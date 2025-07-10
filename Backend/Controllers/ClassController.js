
const Class = require('../Model/ClassModel');

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new class
exports.createClass = async (req, res) => {
    const classData = new Class({
        teacherID: req.body.teacherID,
        teacherName: req.body.teacherName,
        className: req.body.className,
        subject: req.body.subject,
        schedule: req.body.schedule,
        duration: req.body.duration,
        room: req.body.room,
        description: req.body.description,
        mcqs: req.body.mcqs || [] // Include MCQs if provided
    });

    try {
        const newClass = await classData.save();
        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get class by ID
exports.getClassById = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id);
        if (classData) {
            res.json(classData);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update class
exports.updateClass = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const updateFields = {
            teacherID: req.body.teacherID || classData.teacherID,
            teacherName: req.body.teacherName || classData.teacherName,
            className: req.body.className || classData.className,
            subject: req.body.subject || classData.subject,
            schedule: req.body.schedule || classData.schedule,
            duration: req.body.duration || classData.duration,
            room: req.body.room || classData.room,
            description: req.body.description || classData.description,
            mcqs: req.body.mcqs || classData.mcqs || []
        };

        // Update the document
        const updatedClass = await Class.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete class
exports.deleteClass = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id);
        if (classData) {
            await classData.deleteOne();
            res.json({ message: 'Class deleted' });
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

exports.getClassByRoom = async (req, res) => {
    try {
        const classData = await Class.find({ room: req.params.room });
        console.log("The room is",classData);
        if (classData.length > 0) {
            res.json(classData);
        } else {
            res.status(404).json({ message: 'No class found for this room' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.clearRoomByValue = async (req, res) => {
    const roomValue = req.params.room;
    console.log("Room to clear:", roomValue);
    try {
        const result = await Class.updateMany(
            { room: roomValue },
            { room: null }
        );
        console.log("The result is", result);
        res.json({ message: 'Rooms cleared', modified: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};