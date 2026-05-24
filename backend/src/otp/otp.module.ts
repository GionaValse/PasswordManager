import { Module } from '@nestjs/common';
import { PasswordsModule } from 'src/passwords/passwords.module';
import { VaultsModule } from 'src/vaults/vaults.module';
import { OtpService } from './otp.service';

@Module({
  imports: [PasswordsModule, VaultsModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
