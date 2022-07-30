import { EPlanType } from '@/interfaces/billing.interface';
import { ICoupon } from '@/interfaces/coupon.interface';
import { model, Schema, Document } from 'mongoose';

const couponSchema: Schema = new Schema({
  code: String,
  planType: {
    type: String,
    enum: Object.values(EPlanType)
  },
  planId: String,
  discountPercent: Number,
  units: {
    type: Number,
    default: 1
  },
  isPublic: Boolean,
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

couponSchema.index({ code: 1, planId: 1 })
const couponModel = model<ICoupon & Document>('Coupon', couponSchema);

export default couponModel;
