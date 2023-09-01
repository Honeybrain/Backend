import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { HelloworldService } from './helloworld.service';
import { ApiTags } from '@nestjs/swagger';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { GreeterProtoService } from './_utils/interfaces/greeter-proto.interface';
import { HelloReplyDto } from './_utils/dto/response/hello-reply.dto';
import { HelloRequestDto } from './_utils/dto/request/hello-request.dto';
import { GrpcAuthGuard } from '../user/_utils/jwt/grpc-auth.guard';
import { MetadataWithUser } from '../user/_utils/interface/metadata-with-user.interface';

@Controller('helloworld')
@ApiTags('Hello world')
export class HelloworldController {
  constructor(
    @Inject('HELLOWORLD_PACKAGE') private readonly client: ClientGrpc,
    private readonly helloworldService: HelloworldService,
  ) {}

  private greeterProtoService = this.client.getService<GreeterProtoService>('Greeter');

  @Get('say-hello')
  sayHello(@Query() query: HelloRequestDto): HelloReplyDto {
    return this.greeterProtoService.sayHello(query);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('Greeter', 'SayHello')
  sayHelloGrpc(helloRequestDto: HelloRequestDto, metadata: MetadataWithUser): HelloReplyDto {
    console.log(metadata);
    return this.helloworldService.sayHello(helloRequestDto.name);
  }
}
