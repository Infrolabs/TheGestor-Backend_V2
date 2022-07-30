import { IAttachment } from '@/interfaces/attachment.interface';
import { model, Schema, Document } from 'mongoose';

const attachmentSchema: Schema = new Schema({
  folderName: {
    type: String,
    required: true,
  },
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Attachment'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  parent_folder_id: {
    type: Schema.Types.ObjectId,
    ref: 'Archive',
    default: null
  }
}, {
  timestamps: true
})

attachmentSchema.index({ createdBy: 1, parent_folder_id: 1, folderName: 1 })
const attachmentModel = model<IAttachment & Document>('Attachment', attachmentSchema);

export default attachmentModel;
