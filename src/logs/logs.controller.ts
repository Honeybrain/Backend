import { Controller, Get, Inject } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsProtoService } from './_utils/interface/logs-proto.interface';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { first } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { LogReplyDto } from './_utils/dto/response/log-reply.dto';

@Controller('logs')
@ApiTags('Logs')
export class LogsController {
  constructor(
    @Inject('LOGS_PACKAGE') private readonly client: ClientGrpc,
    private readonly logsService: LogsService,
  ) {}

  private logsProtoService: LogsProtoService = this.client.getService<LogsProtoService>('Logs');

  @Get('logs')
  streamLogs() {
    return this.logsProtoService.StreamLogs().pipe(first());
  }

  @GrpcMethod('Logs', 'StreamLogs')
  streamLogs$(_data: unknown, _metadata: Metadata, call: ServerUnaryCall<unknown, LogReplyDto>) {
    return this.logsService.streamLogs$(call);
  }
}
