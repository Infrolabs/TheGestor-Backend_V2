import { EBillingPaymentStatus, EPlanType, ESubscriptionStatus, IBilling } from '@/interfaces/billing.interface';
import { model, Schema, Document } from 'mongoose';

const billingSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  orderNo: String,
  invoiceNo: String,
  address: String,
  cifNif: String,
  email: String,
  province: String,
  country: String,
  zipCode: String,
  city: String,
  planId: String,
  expiryDate: Date,
  amount: Number,
  unitCost: Number,
  subTotal: Number,
  vat: Number,
  discount: Number,
  units: Number,
  coupon: String,
  planType: {
    type: String,
    enum: Object.values(EPlanType),
  },
  paymentStatus: {
    type: String,
    enum: Object.values(EBillingPaymentStatus),
    default: EBillingPaymentStatus.PENDING
  },
  subscriptionStatus: {
    type: String,
    enum: Object.values(ESubscriptionStatus),
    default: ESubscriptionStatus.RECURRING
  },
  transactionDetails: {
    type: Object
  },
  errorDetails: {
    type: Object
  }
}, {
  timestamps: true
})

billingSchema.index({ user: 1, coupon: 1 })
const billingModel = model<IBilling & Document>('Billing', billingSchema);

export default billingModel;
