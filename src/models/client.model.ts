import { EClientType, IClient } from '@/interfaces/client.interface';
import { model, Schema, Document } from 'mongoose';

const clientSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  favourite: {
    default: false,
    type: Boolean
  },
  zipCode:String,
  city: String,
  province: String,
  businessName: String,
  clientType: {
    type: String,
    required: true,
    enum: Object.values(EClientType)
  },
  phoneNumber:String,
  countryCode: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  country: String,
  cifNif: String,
  image: String,
  address:String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

clientSchema.index({ cifNif: 1, createdBy: 1 })
const clientModel = model<IClient & Document>('Client', clientSchema);

export default clientModel;
