import { Module } from '@nestjs/common';
import { PasswordsModule } from 'src/passwords/passwords.module';
import { OtpService } from './otp.service';

@Module({
  imports: [PasswordsModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
