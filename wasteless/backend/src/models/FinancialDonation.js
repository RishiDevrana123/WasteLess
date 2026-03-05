import mongoose from 'mongoose';

const financialDonationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentDetails: {
        stripeSessionId: String,
        stripePaymentIntentId: String,
    }
}, { timestamps: true });

export default mongoose.model('FinancialDonation', financialDonationSchema);
