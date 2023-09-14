import { Controller } from '@nestjs/common';
import { LogsService } from './logs.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { LogReplyDto } from './_utils/dto/response/log-reply.dto';

@Controller('logs')
@ApiTags('Logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @GrpcMethod('Logs', 'StreamLogs')
  streamLogs$(_data: unknown, _metadata: Metadata, call: ServerUnaryCall<unknown, LogReplyDto>) {
    return this.logsService.streamLogs$(call);
  }
}
