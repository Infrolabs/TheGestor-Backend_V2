import { IArchive } from '@/interfaces/archive.interface';
import { model, Schema, Document } from 'mongoose';

const archiveSchema: Schema = new Schema({
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
  },
}, {
  timestamps: true
})

archiveSchema.index({ createdBy: 1, parent_folder_id: 1, folderName: 1 })
const archiveModel = model<IArchive & Document>('Archive', archiveSchema);

export default archiveModel;
