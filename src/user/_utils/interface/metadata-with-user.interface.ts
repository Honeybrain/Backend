import { Metadata } from '@grpc/grpc-js';
import { UserDocument } from '../../user.schema';

export interface MetadataWithUser extends Metadata {
  user: UserDocument;
}
