import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { HelloworldService } from './helloworld.service';
import { ApiTags } from '@nestjs/swagger';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { GreeterProtoService } from './_utils/interfaces/greeter-proto.interface';
import { HelloReplyDto } from './_utils/dto/response/hello-reply.dto';
import { HelloRequestDto } from './_utils/dto/request/hello-request.dto';

@Controller('helloworld')
@ApiTags('Hello world')
export class HelloworldController implements OnModuleInit {
  constructor(
    @Inject('HELLOWORLD_PACKAGE') private readonly client: ClientGrpc,
    private readonly helloworldService: HelloworldService,
  ) {}

  private greeterProtoService: GreeterProtoService;

  onModuleInit() {
    this.greeterProtoService = this.client.getService('Greeter');
  }

  @Get('say-hello')
  sayHello(@Query() query: HelloRequestDto): HelloReplyDto {
    return this.greeterProtoService.sayHello(query);
  }

  @GrpcMethod('Greeter', 'SayHello')
  sayHelloGrpc(data: HelloRequestDto): HelloReplyDto {
    return this.helloworldService.sayHello(data.name);
  }
}
