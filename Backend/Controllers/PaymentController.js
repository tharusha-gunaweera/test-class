const { get } = require("mongoose");
const Payment = require("../Model/PaymentModel");

//Display
const getAllPayments = async (req, res, next) => {
    let payments;

    try {
        payments = await Payment.find();
    } catch (err) {
        console.log(err);
    }

    if(!payments){
        return res.status(404).json({message:"No Payments Found"});
    }

    return res.status(200).json(payments);
};

//Insert
const addPayments = async (req, res, next) => {
    try {
        // Log the request body to see what's being received
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const {studentName,studentId,studyingYear,courseName,paymentMonth,cardNumber,expiryDate,cvv,amount} = req.body;

        // Validate required fields
        if (!studentName || !studentId || !studyingYear || !courseName || !paymentMonth || !cardNumber || !expiryDate || !cvv|| !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const payment = new Payment({
            studentName,
            studentId,
            studyingYear,
            courseName,
            paymentMonth,
            cardNumber,
            expiryDate,
            cvv,
            amount
        });

        await payment.save();
        return res.status(201).json({ payment });
    } catch (err) {
        console.error('Error in addPayments:', err);
        return res.status(500).json({ message: "Error creating payment", error: err.message });
    }
}

//Get ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let payment;

    try {
        payment = await Payment.findById(id);
    } catch (err) {
        console.log(err);
    }
    if(!payment){
        return res.status(404).json({message:"Unable to find payment"});
    }
    return res.status(200).json({ payment });
}

//Update
const updatePayment = async (req, res, next) => {
    const id =req.params.id;
    const {studentName,studentId,studyingYear,courseName,paymentMonth,cardNumber,expiryDate,cvv,amount} = req.body;

    let payment;
    try {
        payment = await Payment.findByIdAndUpdate(id, 
            {studentName:studentName,studentId:studentId,studyingYear:studyingYear,courseName:courseName,paymentMonth:paymentMonth,cardNumber:cardNumber,expiryDate:expiryDate,cvv:cvv,amount:amount});
            payments = await payment.save();
    } catch (err) {
        console.log(err);
    }
    if(!payment){
        return res.status(404).json({message:"Unable to Update payment"});
    }
    return res.status(200).json({ payment });
}

//Delete
const deletePayment = async (req, res, next) => {
    const id = req.params.id;
    let payment;

    try {
        payment = await Payment.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if(!payment){
        return res.status(404).json({message:"Unable to Delete payment"});
    }
    return res.status(200).json({ payment });
}

exports.getAllPayments = getAllPayments;
exports.addPayments = addPayments;
exports.getById = getById;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;