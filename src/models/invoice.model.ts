import { EInvoiceStatus, EInvoiceTemplate, EPaymentMethod, EVatType, IInvoice } from '@/interfaces/invoice.interface';
import { model, Schema, Document } from 'mongoose';

const invoiceSchema: Schema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  saved: {
    type: Boolean,
    default: false
  },
  isEquivalance: {
    type: Boolean,
    default: false
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
  isManuallyCreated: {
    type: Boolean,
    default: false
  },
  invoiceNo: String,
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  additionalDetails: String,
  paymentMethod: {
    type: String,
    enum: Object.values(EPaymentMethod)
  },
  bankName: String,
  accountHolder: String,
  iban: String,
  swiftCode: String,
  status: {
    type: String,
    default: EInvoiceStatus.PENDING,
    enum: Object.values(EInvoiceStatus)
  },
  template: {
    type: String,
    default: EInvoiceTemplate.MODERN,
    enum: Object.values(EInvoiceTemplate)
  },
  subTotal: Number,
  vat: Number,
  irpf: Number,
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
    vatType: {
      type: String,
      enum: Object.values(EVatType)
    },
    selectedQuantity: Number,
  }],
  bizum: {
    mobileNumber: String
  },
  bizumNo: String,
  attachments: {
    type: [{
      name: String,
      url: String,
      date: Date,
      size: String,
      type: String,
    }],
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

invoiceSchema.index({ createdBy: 1, invoiceNo: 'text', invoiceDate: -1 })
const invoiceModel = model<IInvoice & Document>('Invoice', invoiceSchema);

export default invoiceModel;
