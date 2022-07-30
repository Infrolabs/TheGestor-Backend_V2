import { ENotificationType, INotification } from '@/interfaces/notification.interface';
import { model, Schema, Document } from 'mongoose';

const notificationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  localizationMessages: {
    es: String,
    en: String
  },
  type: {
    type: String,
    enum: Object.values(ENotificationType)
  },
  isSeen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

notificationSchema.index({ userId: 1 })
const notificationModel = model<INotification & Document>('Notification', notificationSchema);

export default notificationModel;
