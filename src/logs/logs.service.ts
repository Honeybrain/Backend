import { Injectable, Logger } from '@nestjs/common';
import { watch } from 'chokidar';
import { LogReplyDto } from './_utils/dto/response/log-reply.dto';
import { readFile } from 'fs/promises';
import { Subject } from 'rxjs';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class LogsService {
  private logger = new Logger(LogsService.name);

  private processFileChange(path: string, subject: Subject<LogReplyDto>) {
    this.logger.debug(`File ${path} has been changed or added`);

    readFile(path, 'utf8')
      .then((logContent) => subject.next({ content: logContent }))
      .catch((err) => {
        throw new RpcException(`Error reading file: ${err}`);
      });
  }

  streamLogs$(call: ServerUnaryCall<unknown, LogReplyDto>): Subject<LogReplyDto> {
    const subject = new Subject<LogReplyDto>();

    // Can be optimized by using a global watcher because we only watch the same file
    const watcher = watch('/app/honeypot/fast.log', { persistent: true });

    watcher
      .on('add', (path) => this.processFileChange(path, subject))
      .on('change', (path) => this.processFileChange(path, subject))
      .on('error', (error) => this.logger.error(`Watcher error: ${error}`));

    call.on('cancelled', () => watcher.close());

    return subject;
  }
}
