import { Test, TestingModule } from '@nestjs/testing';
import { ContainersService } from '../../src/containers/containers.service';
import { Subject } from 'rxjs';
import { ContainersReplyDto } from '../../src/containers/_utils/dto/response/container-reply.dto';

describe('ContainersService', () => {
  let service: ContainersService;
  let result: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContainersService],
    }).compile();

    service = module.get<ContainersService>(ContainersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('streamContainers', () => {
    it('should return a Subject of ContainersReplyDto', async () => {
      result = service.streamContainers();
      expect(result).toBeInstanceOf(Subject<ContainersReplyDto>);
    });

  });
});
