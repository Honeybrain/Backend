import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword, validateSync } from 'class-validator';
import { exit } from 'process';

export class EnvironmentVariables {
  @IsNumber()
  PORT = 3000;

  @IsString()
  MONGODB_URL: string = 'mongodb://127.0.0.1:27017/honeybrain';

  @IsString()
  JWT_SECRET = 'H0N3YBRA1N!*';

  @IsOptional()
  @IsEmail()
  CREATE_ADMIN_EMAIL?: string;

  @IsStrongPassword({
    minLowercase: 1,
    minLength: 10,
    minNumbers: 2,
    minUppercase: 1,
    minSymbols: 1,
  })
  CREATE_ADMIN_PASSWORD: string = 'H0N3Y_Adm1n_PasS';
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length) {
    new Logger(validateEnv.name).error(errors.toString());
    exit();
  }
  return validatedConfig;
}
