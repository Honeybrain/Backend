import { Injectable, Logger } from '@nestjs/common';
import { HelloReplyDto } from './_utils/dto/response/hello-reply.dto';

@Injectable()
export class HelloworldService {
  private readonly logger = new Logger(HelloworldService.name);

  sayHello(name: string): HelloReplyDto {
    const message = `Hello ${name}`;
    this.logger.log(message);
    return { message: message };
  }
}
