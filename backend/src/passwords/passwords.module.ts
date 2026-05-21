import { forwardRef, Module } from '@nestjs/common';
import { PasswordsController } from './passwords.controller';
import { PasswordsService } from './passwords.service';
import { PasswordsRepository } from './passwords.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordEntity } from './passwords.entity';
import { VaultsModule } from 'src/vaults/vaults.module';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordEntity]), forwardRef(() => VaultsModule)],
  controllers: [PasswordsController],
  providers: [PasswordsService, PasswordsRepository],
  exports: [PasswordsService],
})
export class PasswordsModule {}
