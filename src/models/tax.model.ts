import { ETaxStatus, ETaxType, ITax } from '@/interfaces/tax.interface';
import { model, Schema, Document } from 'mongoose';

const taxSchema: Schema = new Schema({
  pendingTax: String,
  vat: {
    type: String,
    required: true
  },
  irpf: {
    type: String,
    required: true
  },
  retentionProviders: {
    type: String,
    required: true
  },
  retentionRent: {
    type: String,
    required: true
  },
  presentPeriod: {
    type: Date,
  },
  details: String,
  year: Number,
  trimester: Number,
  cifNif: String,
  name: String,
  status: {
    type: String,
    enum: Object.values(ETaxStatus),
    default: ETaxStatus.PENDING
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(ETaxType)
  },
  data: Object,
  note: String
}, {
  timestamps: true
})

taxSchema.index({ year: 1, trimester: 1, userId: 1 })
const taxModel = model<ITax & Document>('Tax', taxSchema);

export default taxModel;
