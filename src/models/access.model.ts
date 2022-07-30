import { IAccess, EAccessStatus, EAccessType } from '@/interfaces/access.interface';
import { model, Schema, Document } from 'mongoose';

const accessSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  email: String,
  accessType: {
    type: String,
    enum: Object.values(EAccessType)
  },
  status: {
    type: String,
    enum: Object.values(EAccessStatus),
    default: EAccessStatus.SENT
  }
}, {
  timestamps: true
})

accessSchema.index({ user: 1, email: 1 })
const accessModel = model<IAccess & Document>('Access', accessSchema);

export default accessModel;
