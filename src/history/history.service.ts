import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistoryDocument } from './history.schema';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {}

  async addHistoryEntry(dto: any): Promise<History> {
    const newHistoryEntry = new this.historyModel(dto);
    return newHistoryEntry.save();
  }

  async getHistory(): Promise<History[]> {
    return this.historyModel.find().sort({ date: -1 }).exec();
  }
}
