import { forwardRef, Module } from '@nestjs/common';
import { VaultsController } from './vaults.controller';
import { VaultsService } from './vaults.service';
import { PasswordsModule } from 'src/passwords/passwords.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultEntity } from './vaults.entity';
import { VaultsRepository } from './vaults.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VaultEntity]), forwardRef(() => PasswordsModule)],
  controllers: [VaultsController],
  providers: [VaultsService, VaultsRepository],
  exports: [VaultsService, VaultsRepository],
})
export class VaultsModule {}
