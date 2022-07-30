import { EVatType } from '@/interfaces/invoice.interface';
import { EItemIrpf, EItemServiceType, EItemType, IItem } from '@/interfaces/item.interface';
import { model, Schema, Document } from 'mongoose';

const itemSchema: Schema = new Schema({
  itemType: {
    type: String,
    required: true,
    enum: Object.values(EItemType)
  },
  favourite: {
    default: false,
    type: Boolean
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  reference: String,
  quantity:Number,
  serviceType: {
    type: String,
    enum: Object.values(EItemServiceType)
  },
  cost: {
    type: Number,
    required: true
  },
  vat: Number,
  irpf: {
    type: Number,
    enum: Object.values(EItemIrpf),
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vatType: {
    type: String,
    enum: Object.values(EVatType)
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

itemSchema.index({ createdBy: 1, reference: 1 })
const itemModel = model<IItem & Document>('Item', itemSchema);

export default itemModel;
