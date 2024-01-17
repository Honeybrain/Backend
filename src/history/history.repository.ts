import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { History, HistoryDocument } from './history.schema';

@Injectable()
export class HistoryRepository {
  constructor(@InjectModel(History.name) private model: Model<HistoryDocument>) {}

  async createHistoryEntry(dto: any): Promise<HistoryDocument> {
    return this.model.create(dto);
  }

  async getSortedHistory(): Promise<HistoryDocument[]> {
    return this.model.find().sort({ date: -1 }).exec();
  }
}
