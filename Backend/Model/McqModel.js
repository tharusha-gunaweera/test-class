const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: [true, "Question text is required"],
        trim: true
    },

    clName:{
        type:String,
        required:true,
    },

    options: {
        type: [String],
        required: [true, "Options are required"],
        validate: {
            validator: function(options) {
                return options.length === 4;
            },
            message: "There must be exactly 4 options"
        }
    },
    correctAnswer: {
        type: Number,
        required: [true, "Correct answer index is required"],
        min: [0, "Correct answer index must be between 0 and 3"],
        max: [3, "Correct answer index must be between 0 and 3"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

questionSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model(
    "QuestionModel",
    questionSchema
);