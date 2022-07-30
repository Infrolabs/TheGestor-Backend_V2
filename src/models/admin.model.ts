import { IAdmin } from '@/interfaces/admin.interface';
import { model, Schema, Document } from 'mongoose';

const adminSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    countryCode: String,
    phone: String,
    password: {
        type: String,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
  timestamps: true
})

adminSchema.index({ email: 1 })
const adminModel = model<IAdmin & Document>('Admin', adminSchema);

export default adminModel;
