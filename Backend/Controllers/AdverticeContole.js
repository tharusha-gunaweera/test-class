const Advertisement = require('../Model/AdverticeModel');


exports.getAllAdvertisements = async (req, res) => {
    try {
        const advertisements = await Advertisement.find().sort({ createdAt: -1 });
        res.status(200).json(advertisements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAdvertisementById = async (req, res) => {
    try {
        const advertisement = await Advertisement.findById(req.params.id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }
        res.status(200).json(advertisement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createAdvertisement = async (req, res) => {
    try {
        const { date, month, topic, description } = req.body;
        
        // Validate required fields
        if (!date || !month || !topic || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newAdvertisement = new Advertisement({
            date,
            month,
            topic,
            description
        });

        const savedAdvertisement = await newAdvertisement.save();
        res.status(201).json(savedAdvertisement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateAdvertisement = async (req, res) => {
    try {
        const { date, month, topic, description } = req.body;
        
        const advertisement = await Advertisement.findById(req.params.id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        // Update fields if they are provided
        if (date) advertisement.date = date;
        if (month) advertisement.month = month;
        if (topic) advertisement.topic = topic;
        if (description) advertisement.description = description;

        const updatedAdvertisement = await advertisement.save();
        res.status(200).json(updatedAdvertisement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.findById(req.params.id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        await advertisement.deleteOne();
        res.status(200).json({ message: 'Advertisement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 