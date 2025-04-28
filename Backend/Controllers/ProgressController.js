const Progress = require('../Model/ProgressModel');


exports.createProgress = async (req, res) => {
    try {
        const { userId, userName } = req.body;
        const progress = new Progress({
            userId,
            userName,
            redFlagCount: 0,
            orangeFlagCount: 0,
            greenFlagCount: 0
        });
        await progress.save();
        res.status(201).json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAllProgress = async (req, res) => {
    try {
        console.log('Fetching all progress entries...');
        const progress = await Progress.find();
        console.log('Found progress entries:', progress);
        
        if (!progress || progress.length === 0) {
            return res.status(200).json({ message: 'No progress entries found', data: [] });
        }
        
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error in getAllProgress:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.getProgressByUserId = async (req, res) => {
    try {
        console.log('Searching for progress with userId:', req.params.userId);
        const progress = await Progress.findOne({ userId: req.params.userId });
        console.log('Found progress:', progress);
        
        if (!progress) {
            console.log('No progress found for userId:', req.params.userId);
            return res.status(404).json({ message: 'Progress not found' });
        }
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error in getProgressByUserId:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.updateQuizProgress = async (req, res) => {
    try {
        const { userId, userName, isCorrect, hasAnswered } = req.body;
        console.log('Received POST request data:', { userId, userName, isCorrect, hasAnswered });
        
        if (!userId) {
            console.error('userId is missing in request');
            return res.status(400).json({ message: 'userId is required' });
        }

        if (!userName) {
            console.error('userName is missing in request');
            return res.status(400).json({ message: 'userName is required' });
        }

        // Find the user's progress
        let progress = await Progress.findOne({ userId });
        console.log('Existing progress found:', progress);
        
        if (!progress) {
            console.log('Creating new progress entry');
            // Create new progress entry if none exists
            progress = new Progress({
                userId,
                userName,
                redFlagCount: 0,
                orangeFlagCount: 0,
                greenFlagCount: 0
            });
            console.log('New progress entry created:', progress);
        }

        // Update flag counts based on the response
        if (!hasAnswered) {
            progress.redFlagCount += 1;
            console.log('Incrementing red flag count');
        } else if (isCorrect) {
            progress.greenFlagCount += 1;
            console.log('Incrementing green flag count');
        } else {
            progress.orangeFlagCount += 1;
            console.log('Incrementing orange flag count');
        }

        await progress.save();
        console.log('Progress saved successfully:', progress);
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error in updateQuizProgress:', error);
        res.status(400).json({ message: error.message });
    }
};


exports.updateExistingProgress = async (req, res) => {
    try {
        const { userId, isCorrect, hasAnswered } = req.body;
        console.log('Updating existing progress for user:', userId);
        
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        // Find the user's progress
        const progress = await Progress.findOne({ userId });
        
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        // Update flag counts based on the response
        if (!hasAnswered) {
            progress.redFlagCount += 1;
        } else if (isCorrect) {
            progress.greenFlagCount += 1;
        } else {
            progress.orangeFlagCount += 1;
        }

        await progress.save();
        console.log('Existing progress updated:', progress);
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error updating existing progress:', error);
        res.status(400).json({ message: error.message });
    }
};


exports.updateProgress = async (req, res) => {
    try {
        const { redFlagCount, orangeFlagCount, greenFlagCount } = req.body;
        const progress = await Progress.findByIdAndUpdate(
            req.params.id,
            {
                redFlagCount,
                orangeFlagCount,
                greenFlagCount
            },
            { new: true }
        );
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }
        res.status(200).json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteProgress = async (req, res) => {
    try {
        const progress = await Progress.findByIdAndDelete(req.params.id);
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }
        res.status(200).json({ message: 'Progress deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 