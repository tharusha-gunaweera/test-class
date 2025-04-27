const express = require("express");
const router = express.Router();
const Payment = require("../Model/PaymentModel");
const PaymentController = require("../Controllers/PaymentController");

router.get("/",PaymentController.getAllPayments);
router.post("/",PaymentController.addPayments);
router.get("/:id",PaymentController.getById);
router.put("/:id",PaymentController.updatePayment);
router.delete("/:id",PaymentController.deletePayment);

module.exports = router;