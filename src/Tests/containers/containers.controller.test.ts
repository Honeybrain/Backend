import { Test, TestingModule } from '@nestjs/testing';
import { ContainersController } from '../../src/containers/containers.controller';
import { ContainersService } from '../../src/containers/containers.service';
import { Subject } from 'rxjs';

describe('ContainersController', () => {
  let controller: ContainersController;
  let service: ContainersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContainersController],
      providers: [ContainersService],
    }).compile();

    controller = module.get<ContainersController>(ContainersController);
    service = module.get<ContainersService>(ContainersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('streamContainers', () => {
    it('should call streamContainers method from service', () => {
      const mockSubject = new Subject<any>();
      jest.spyOn(service, 'streamContainers').mockReturnValue(mockSubject);

      const result = controller.streamContainers();

      expect(service.streamContainers).toHaveBeenCalled();
      expect(result).toBe(mockSubject);
    });
  });
});
