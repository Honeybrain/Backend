import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/config';
import { UserRepository } from '../user/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<EnvironmentVariables, true>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserRepository],
  exports: [JwtModule, UserRepository],
})
export class GlobalModule {}
