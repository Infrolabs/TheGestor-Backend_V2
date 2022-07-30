import { IAdminActivity } from '@/interfaces/admin.activity.interface';
import { model, Schema, Document } from 'mongoose';

const adminActivitySchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    log: String
}, {
  timestamps: true
})

adminActivitySchema.index({ userId: 1 })
const adminActivityModel = model<IAdminActivity & Document>('AdminActivity', adminActivitySchema);

export default adminActivityModel;
