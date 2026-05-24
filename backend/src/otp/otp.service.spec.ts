import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordsService } from 'src/passwords/passwords.service';
import { rotateOtpCode } from 'src/tools/otp';
import { VaultsService } from 'src/vaults/vaults.service';
import { OtpService } from './otp.service';

jest.mock('src/tools/otp', () => ({
  rotateOtpCode: jest.fn().mockReturnValue('MOCK66'),
}));

describe('OtpService', () => {
  let service: OtpService;
  let passwordsService: jest.Mocked<Partial<PasswordsService>>;
  let vaultsService: jest.Mocked<Partial<VaultsService>>;
  let eventEmitter: jest.Mocked<Partial<EventEmitter2>>;
  let schedulerRegistry: SchedulerRegistry;

  const originalEnv = process.env.OTP_EXPIRES_IN;

  beforeEach(async () => {
    jest.useFakeTimers();
    process.env.OTP_EXPIRES_IN = '30000';

    passwordsService = {
      findOtps: jest.fn().mockResolvedValue([]),
      updateOtpCode: jest.fn().mockResolvedValue({} as any),
    };

    vaultsService = {
      findOne: jest.fn(),
    };

    eventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        SchedulerRegistry,
        { provide: PasswordsService, useValue: passwordsService },
        { provide: VaultsService, useValue: vaultsService },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    process.env.OTP_EXPIRES_IN = originalEnv;

    try {
      schedulerRegistry.deleteInterval('otpGlobalCycle');
    } catch (e) {}
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should register the global interval in the SchedulerRegistry', () => {
      service.onApplicationBootstrap();

      const intervals = schedulerRegistry.getIntervals();
      expect(intervals).toContain('otpGlobalCycle');
    });
  });

  describe('getInitialStatus', () => {
    it('should return the correct remaining TTL time', () => {
      service.onApplicationBootstrap();

      jest.advanceTimersByTime(10000);

      const status = service.getInitialStatus();

      expect(status.maxTtl).toBe(30000);
      expect(status.ttl).toBeLessThanOrEqual(20000);
    });

    it('should clamp the TTL to 0 if the elapsed time exceeds maxTtl', () => {
      service.onApplicationBootstrap();

      jest.advanceTimersByTime(40000);

      const status = service.getInitialStatus();
      expect(status.ttl).toBe(0);
    });
  });

  describe('rotateOtpCodes (Interval Execution)', () => {
    it('should fetch passwords, update database, group codes by user and emit local events', async () => {
      const mockPasswords = [
        { id: 'pass-1', service: 'Google', vaultId: 'vault-1' },
        { id: 'pass-2', service: 'Github', vaultId: 'vault-1' },
        { id: 'pass-3', service: 'AWS', vaultId: 'vault-2' },
      ];
      passwordsService.findOtps.mockResolvedValue(mockPasswords as any);

      vaultsService.findOne.mockImplementation(async (vaultId: string) => {
        if (vaultId === 'vault-1') return { ownerId: 'user-A' } as any;
        if (vaultId === 'vault-2') return { ownerId: 'user-B' } as any;
        return null as any;
      });

      service.onApplicationBootstrap();

      await jest.advanceTimersByTimeAsync(30000);

      expect(passwordsService.findOtps).toHaveBeenCalled();
      expect(rotateOtpCode).toHaveBeenCalledWith('pass-1', 30000);
      expect(rotateOtpCode).toHaveBeenCalledWith('pass-2', 30000);
      expect(rotateOtpCode).toHaveBeenCalledWith('pass-3', 30000);
      expect(passwordsService.updateOtpCode).toHaveBeenCalledWith('pass-1', 'MOCK66');
      expect(passwordsService.updateOtpCode).toHaveBeenCalledWith('pass-2', 'MOCK66');
      expect(passwordsService.updateOtpCode).toHaveBeenCalledWith('pass-3', 'MOCK66');

      expect(eventEmitter.emit).toHaveBeenCalledWith('otp.rotated', {
        maxTtl: 30000,
        userId: 'user-A',
        codes: {
          'pass-1': 'MOCK66',
          'pass-2': 'MOCK66',
        },
      });

      expect(eventEmitter.emit).toHaveBeenCalledWith('otp.rotated', {
        maxTtl: 30000,
        userId: 'user-B',
        codes: {
          'pass-3': 'MOCK66',
        },
      });

      expect(eventEmitter.emit).toHaveBeenCalledTimes(2);
    });
  });
});
