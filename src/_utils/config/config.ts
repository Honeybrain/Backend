import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword, validateSync } from 'class-validator';
import { exit } from 'process';

export class EnvironmentVariables {
  @IsNumber()
  PORT: number = 3001;

  @IsString()
  MONGODB_URL: string = 'mongodb://mongo:27017/honeybrain';

  @IsString()
  GRPC_URL: string = 'backend:50051';

  @IsString()
  JWT_SECRET: string = 'H0N3YBRA1N!*';

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

  @IsString()
  SMTP_HOST: string;

  @IsString()
  SMTP_FROM: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASSWORD: string;

  @IsBoolean()
  SMTP_PREVIEW: boolean = false;
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
