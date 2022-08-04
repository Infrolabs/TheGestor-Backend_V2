import { model, Schema, Document } from 'mongoose';
import { ELanguage, IUser, EUserAnswer1, EUserAnswer2, EUserAnswer3, EUserType } from '@interfaces/users.interface';
import { EPremiumType } from '@/interfaces/premium.interface';

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  companyName: String,
  areaHome: String,
  areaOffice: String,
  address: String,
  city: String,
  zipCode: String,
  province: String,
  country: String,
  website: String,
  iae: String,
  cnae: String,
  isVerified: {
    type: Boolean,
    default: true
  },
  userType: {
    type: String,
    required: true,
    enum: Object.values(EUserType),
  },
  officeType: String,
  cifNif: String,
  countryCode: String,
  phoneNumber: String,
  image: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
  },
  bank: {
    bankName: String,
    accountHolder: String,
    iban: String,
    swiftCode: String,
  },
  bizum: {
    mobileNumber: String
  },
  nordigenRequisitionId: {
    type: String
  },
  accounts: {
    type: [{
      accountId: String,
      bankLogo: String,
      accessToken: String,
      refreshToken: String,
      name: String,
      iban: String,
      institution_id: String,
      isRefreshing: {
        type: Boolean,
        default: false
      },
      balances: {
        type: [{
          balanceAmount: Object,
          balanceType: String,
          referenceDate: String
        }],
        default: []
      },
    }],
    default: []
  },
  invoiceLogo: String,
  invoiceLanguage: {
    type: String,
    enum: Object.values(ELanguage),
  },
  adminNote: String,
  taxConfig: {
    form303: {
      type: Boolean,
      default: true
    },
    form390: {
      type: Boolean,
      default: true
    },
    form349Q: {
      type: Boolean,
      default: true
    },
    form349A: {
      type: Boolean,
      default: true
    },
    form111: {
      type: Boolean,
      default: true
    },
    form190: {
      type: Boolean,
      default: true
    },
    form347: {
      type: Boolean,
      default: true
    },
    form130: {
      type: Boolean,
      default: true
    },
    form100: {
      type: Boolean,
      default: true
    },
    form115: {
      type: Boolean,
      default: true
    },
    form180: {
      type: Boolean,
      default: true
    }
  },
  userAnswer: {
    answer1: {
      type: String,
      enum: Object.values(EUserAnswer1)
    },
    answer2: {
      type: String,
      enum: Object.values(EUserAnswer2)
    },
    answer3: {
      type: String,
      enum: Object.values(EUserAnswer3)
    }
  },
  notificationSettings: {
    pendingInvoices: {
      type: Boolean,
      default: true
    },
    taxes: {
      type: Boolean,
      default: true
    },
  },
  language: {
    type: String,
    enum: Object.values(ELanguage),
    default: ELanguage.ES
  },
  lastBilling: {
    type: Schema.Types.ObjectId,
    ref: 'Billing',
  },
  premiumType: {
    type: String,
    enum: Object.values(EPremiumType),
    default: EPremiumType.FREE
  },
  trialExpiryDate: {
    type: Date
  },
  billingInfo: {
    name: String,
    address: String,
    cifNif: String,
    email: String,
    province: String,
    country: String,
    zipCode: String,
    city: String
  }
}, {
  timestamps: true
})

userSchema.index({ countryCode: 1, phoneNumber: 1, email: 1 })
const userModel = model<IUser & Document>('User', userSchema);

export default userModel;
