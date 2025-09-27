const Payment = require('../models/Payment');
const Listing = require('../models/Listing');

// ✅ Add a payment record
exports.addRecord = async (req, res) => {
    try {
        const { listingID, amount, paidBy, paidFor, description } = req.body;

        const payment = new Payment({
            listingID,
            amount,
            paidBy,
            paidFor,
            description
        });

        await payment.save();
        res.status(200).json({ status: 'success', message: 'Payment added', payment });
    } catch (err) {
        res.status(500).json({ status: 'failure', message: err.message });
    }
};

// ✅ Get all payment records for a listing
exports.getAllRecords = async (req, res) => {
    try {
        const { listingID } = req.body;
        const payments = await Payment.find({ listingID }).sort({ dateOfPayment: -1 });
        res.status(200).json({ status: 'success', payments });
    } catch (err) {
        res.status(500).json({ status: 'failure', message: err.message });
    }
};

// ✅ Edit a payment record
exports.editRecord = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ status: 'failure', message: 'Payment not found' });

        const { amount, paidBy, paidFor, description } = req.body;
        if (amount) payment.amount = amount;
        if (paidBy) payment.paidBy = paidBy;
        if (paidFor) payment.paidFor = paidFor;
        if (description) payment.description = description;

        await payment.save();
        res.status(200).json({ status: 'success', message: 'Payment updated', payment });
    } catch (err) {
        res.status(500).json({ status: 'failure', message: err.message });
    }
};

// ✅ Delete a payment record
exports.deleteRecord = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) return res.status(404).json({ status: 'failure', message: 'Payment not found' });
        res.status(200).json({ status: 'success', message: 'Payment deleted' });
    } catch (err) {
        res.status(500).json({ status: 'failure', message: err.message });
    }
};

// ✅ Settlement calculation
exports.settlement = async (req, res) => {
    try {
        const { listingID } = req.params;

        // Fetch listing participants
        const listing = await Listing.findById(listingID);
        if (!listing) return res.status(404).json({ status: 'failure', message: 'Listing not found' });

        const participants = listing.participants;

        // Fetch all payments for this listing
        const payments = await Payment.find({ listingID });

        // Track net balances for each participant
        const balance = {};
        participants.forEach(p => balance[p] = 0);

        payments.forEach(payment => {
            const splitAmount = payment.amount / payment.paidFor.length;

            // payer contributes (positive)
            balance[payment.paidBy] += payment.amount;

            // payees owe (negative)
            payment.paidFor.forEach(p => {
                balance[p] -= splitAmount;
            });
        });

        // Convert balance object into settlement transactions
        const settlements = [];
        const debtors = Object.entries(balance).filter(([_, amt]) => amt < 0);
        const creditors = Object.entries(balance).filter(([_, amt]) => amt > 0);

        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            let [debtor, debtAmt] = debtors[i];
            let [creditor, creditAmt] = creditors[j];

            debtAmt = Math.abs(debtAmt);

            const settledAmount = Math.min(debtAmt, creditAmt);

            settlements.push({
                from: debtor,
                to: creditor,
                amount: settledAmount
            });

            debtAmt -= settledAmount;
            creditAmt -= settledAmount;

            if (debtAmt === 0) i++;
            else debtors[i][1] = -debtAmt; // update remaining debt

            if (creditAmt === 0) j++;
            else creditors[j][1] = creditAmt; // update remaining credit
        }

        res.status(200).json({ status: 'success', settlements });

    } catch (err) {
        res.status(500).json({ status: 'failure', message: err.message });
    }
};
