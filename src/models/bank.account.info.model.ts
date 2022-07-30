import { IBankAccountInfo, EBankTransactionStatus } from '@/interfaces/bank.account.info.interface';
import { model, Schema, Document } from 'mongoose';

const bankAccountInfoSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  accountId: String,
  remittanceInformationUnstructured: String,
  bookingDate: String,
  transactionAmount: { amount: String, currency: String },
  details: Object,
  isReconciled: {
    type: Boolean,
    default: false
  },
  income: {
    type: Schema.Types.ObjectId,
    ref: 'Income',
  },
  expense: {
    type: Schema.Types.ObjectId,
    ref: 'Expense',
  },
  incomes: [{
    type: Schema.Types.ObjectId,
    ref: 'Income',
  }],
  expenses: [{
    type: Schema.Types.ObjectId,
    ref: 'Expense',
  }],
  status: {
    type: String,
    enum: Object.values(EBankTransactionStatus)
  }
}, {
  timestamps: true
})

bankAccountInfoSchema.index({ user: 1, accountId: 1, bookingDate: -1 })
const bankAccountInfoModel = model<IBankAccountInfo & Document>('BankAccountInfo', bankAccountInfoSchema);

export default bankAccountInfoModel;
