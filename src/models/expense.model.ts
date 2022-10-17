import { EExpenseType, IExpense } from '@/interfaces/expense.interface';
import { ECommentStatus } from '@/interfaces/income.interface';
import { EPaymentMethod, EVatType } from '@/interfaces/invoice.interface';
import { model, Schema, Document } from 'mongoose';

const expenseSchema: Schema = new Schema({
  invoiceNo: String,
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
  isDraft: {
    type: Boolean,
    default: false
  },
  typeExpense: {
    type: String,
    enum: Object.values(EExpenseType)
  },
  isEquivalance: {
    type: Boolean,
    default: false
  },
  invoiceDate: Date,
  dueDate: Date,
  cifNif: String,
  address: String,
  paymentMethod: {
    type: String,
    enum: Object.values(EPaymentMethod)
  },
  notes: String,
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
  vat: Number,
  irpf: Number,
  subTotal: Number,
  total: Number,
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
  retentionProviders: Number,
  retentionRent: Number,
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    sentAt: {
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

expenseSchema.index({ createdBy: 1, invoiceNo: 'text', invoiceDate: -1 })
const expenseModel = model<IExpense & Document>('Expense', expenseSchema);

export default expenseModel;
