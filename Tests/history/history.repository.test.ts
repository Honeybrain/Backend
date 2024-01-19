import { Test, TestingModule } from '@nestjs/testing';
import { HistoryRepository } from '../../src/history/history.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistoryDocument } from '../../src/history/history.schema';

describe('HistoryRepository', () => {
  let repository: HistoryRepository;
  let model: Model<HistoryDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryRepository,
        {
          provide: getModelToken(History.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<HistoryRepository>(HistoryRepository);
    model = module.get<Model<HistoryDocument>>(getModelToken(History.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

});
