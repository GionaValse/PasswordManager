import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PasswordsService } from 'src/passwords/passwords.service';
import { rotateOtpCode } from 'src/tools/otp';
import { VaultsService } from 'src/vaults/vaults.service';
import { OtpEventDto } from './otp.dto';

@Injectable()
export class OtpService implements OnApplicationBootstrap {
  private maxTtl: number;
  private lastResetTime: number;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private eventEmitter: EventEmitter2,
    private readonly passwordsService: PasswordsService,
    private readonly vaultsService: VaultsService,
  ) {
    this.maxTtl = parseInt(process.env.OTP_EXPIRES_IN || '30000');
  }

  onApplicationBootstrap() {
    this.startGlobalOtpScheduler();
  }

  getInitialStatus() {
    const elapsedTime = Date.now() - this.lastResetTime;
    const remainingTime = Math.max(this.maxTtl - elapsedTime, 0);

    return {
      ttl: remainingTime,
      maxTtl: this.maxTtl,
    };
  }

  private startGlobalOtpScheduler() {
    this.lastResetTime = Date.now();

    const interval = setInterval(() => {
      this.rotateOtpCodes().catch((e) => {
        console.error('Error rotating OTP codes: ', e);
      });
    }, this.maxTtl);

    this.schedulerRegistry.addInterval('otpGlobalCycle', interval);
  }

  private async rotateOtpCodes() {
    const otpPasswords = await this.passwordsService.findOtps();
    const maxTtl = parseInt(process.env.OTP_EXPIRES_IN || '30000');
    const userOtpUpdates = new Map<string, Record<string, string>>();

    await Promise.all(
      otpPasswords.map(async (password) => {
        const newOtpCode = rotateOtpCode(password.id, maxTtl);
        await this.passwordsService.updateOtpCode(password.id, newOtpCode);

        const vaultId = password.vaultId;
        const userId = (await this.vaultsService.findOne(vaultId)).ownerId;

        if (userId) {
          if (!userOtpUpdates.has(userId)) {
            userOtpUpdates.set(userId, {});
          }
          userOtpUpdates.get(userId)![password.id] = newOtpCode;
        }
      }),
    );

    userOtpUpdates.forEach((codes, userId) => {
      const otpEmitData: OtpEventDto = {
        maxTtl,
        userId,
        codes,
      };
      this.eventEmitter.emit('otp.rotated', otpEmitData);
    });
  }
}
