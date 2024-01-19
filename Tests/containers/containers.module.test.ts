import { Test, TestingModule } from '@nestjs/testing';
import { ContainersModule } from '../../src/containers/containers.module';
import { ContainersService } from '../../src/containers/containers.service';
import { ContainersController } from '../../src/containers/containers.controller';

class ContainersServiceMock {
}

describe('ContainersModule', () => {
  let containersService: ContainersService;
  let containersController: ContainersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ContainersModule],
      providers: [
        {
          provide: ContainersService,
          useClass: ContainersServiceMock,
        },
      ],
    }).compile();

    containersService = module.get<ContainersService>(ContainersService);
    containersController = module.get<ContainersController>(ContainersController);
  });

  it('should be defined', () => {
    expect(containersService).toBeDefined();
    expect(containersController).toBeDefined();
  });

});
