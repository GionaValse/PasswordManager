import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { VaultsModule } from './vaults/vaults.module';
import { PasswordsModule } from './passwords/passwords.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '27017'),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      authSource: 'admin',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    VaultsModule,
    PasswordsModule,
    EventsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
