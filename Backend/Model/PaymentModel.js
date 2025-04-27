const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    studentName: {
        type:String,
        required:true
      },
      studentId: {
        type:Number,
        required:true
      },
      studyingYear: {
        type:String,
        required:true
      },
      courseName: {
        type:String,
        required:true
      },
      paymentMonth: {
        type:String,
        required:true
      },
      cardNumber: {
        type:Number,
        required:true
      },
      expiryDate: {
        type:String,
        required:true
      },
      cvv: {
        type:Number,
        required:true
      },
      amount: {
        type:Number,
        required:true
      },
});

module.exports = mongoose.model(
    "PaymentModel",
    paymentSchema
)