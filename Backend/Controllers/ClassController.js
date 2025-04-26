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
        if (classData) {
            Object.assign(classData, req.body);
            const updatedClass = await classData.save();
            res.json(updatedClass);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
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