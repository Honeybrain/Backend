import { HelloRequestDto } from '../dto/request/hello-request.dto';
import { HelloReplyDto } from '../dto/response/hello-reply.dto';

export interface GreeterProtoService {
  sayHello(request: HelloRequestDto): HelloReplyDto;
}
