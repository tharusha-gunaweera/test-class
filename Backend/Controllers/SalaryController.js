const Salary = require('../Model/SalaryModel');

// Calculate and create new salary record
exports.calculateSalary = async (req, res) => {
    try {
        const { teacherName, teachingSubject, teachingYear, totalAmount, instituteCut } = req.body;
        
        // Calculate the final salary
        const cutAmount = (totalAmount * instituteCut) / 100;
        const calculatedSalary = totalAmount - cutAmount;

        const newSalary = new Salary({
            teacherName,
            teachingSubject,
            teachingYear,
            totalAmount,
            instituteCut,
            calculatedSalary
        });

        const savedSalary = await newSalary.save();
        res.status(201).json(savedSalary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all salary records
exports.getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find().sort({ createdAt: -1 });
        res.status(200).json(salaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update salary record
exports.updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { teacherName, teachingSubject, teachingYear, totalAmount, instituteCut } = req.body;

        // Recalculate the salary
        const cutAmount = (totalAmount * instituteCut) / 100;
        const calculatedSalary = totalAmount - cutAmount;

        const updatedSalary = await Salary.findByIdAndUpdate(
            id,
            {
                teacherName,
                teachingSubject,
                teachingYear,
                totalAmount,
                instituteCut,
                calculatedSalary
            },
            { new: true }
        );

        if (!updatedSalary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        res.status(200).json(updatedSalary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete salary record
exports.deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSalary = await Salary.findByIdAndDelete(id);

        if (!deletedSalary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        res.status(200).json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 