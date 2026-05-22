import { Module } from '@nestjs/common';
import { OtpModule } from 'src/otp/otp.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [OtpModule],
  providers: [EventsService, EventsGateway],
  exports: [EventsService],
})
export class EventsModule {}
