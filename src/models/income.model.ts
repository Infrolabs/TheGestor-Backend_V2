import { ECommentStatus, IIncome } from '@/interfaces/income.interface';
import { EPaymentMethod, EVatType } from '@/interfaces/invoice.interface';
import { model, Schema, Document } from 'mongoose';

const incomeSchema: Schema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  invoiceID: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  manualClient: {
    name: String,
    address: String,
    cifNif: String,
  },
  manualItem: [{
    name: String,
    cost: Number,
    unit: Number,
    vat: Number,
    irpf: Number,
    vatName: String,
    vatType: {
      type: String,
      enum: Object.values(EVatType)
    },
  }],
  invoiceNo: String,
  invoiceDate: Date,
  dueDate: Date,
  paymentMethod: {
    type: String,
    enum: Object.values(EPaymentMethod)
  },
  notes: String,
  subTotal: Number,
  total: Number,
  vat: Number,
  irpf: Number,
  vatInfo: {
    vat4: {
      type: Number,
      default: 0
    },
    vat10: {
      type: Number,
      default: 0
    },
    vat21: {
      type: Number,
      default: 0
    }
  },
  items: [{
    itemType: String,
    name: String,
    description: String,
    reference: String,
    quantity: Number,
    serviceType: String,
    cost: Number,
    vat: Number,
    irpf: Number,
    selectedQuantity: Number,
    vatType: {
      type: String,
      enum: Object.values(EVatType)
    },
  }],
  attachments: {
    type: [{
      name: String,
      url: String,
      date: String,
      size: String,
      type: String,
    }],
    default: []
  },
  isEquivalance: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isReconciled: {
    type: Boolean,
    default: false
  },
  transactionDetails: Object,
  comments: [{
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    seenAt: {
      type: Date,
      default: Date.now
    }
  }],
  commentStatus: {
    type: String,
    enum: Object.values(ECommentStatus),
    default: ECommentStatus.UNREAD
  }
}, {
  timestamps: true
})

incomeSchema.index({ createdBy: 1, invoiceNo: 'text', invoiceDate: -1 })
const incomeModel = model<IIncome & Document>('Income', incomeSchema);

export default incomeModel;
