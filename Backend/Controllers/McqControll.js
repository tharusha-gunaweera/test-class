const Mcq  = require('../Model/McqModel');

 
const getAllMcqs = async(request,response,next) => {
    let Mcqs;

    try{
        Mcqs = await Mcq.find();
    }catch(err){
        console.log(err);
    }

    if(!Mcqs){
        return response.status(404).json({message:"Mcqs not found"})
    }

    return response.status(200).json({ Mcqs });
};


const addMcq = async(request,response,next) => {
    const {question,clName,options,correctAnswer} = request.body;

    let Mcqs;

    try{
        Mcqs = new Mcq({question,clName,options,correctAnswer});
        await Mcqs.save();
    }catch(err){
        console.log(err);
    }

    
    if(!Mcqs){
        return response.status(404).json({message:"Unable to insert Mcqs"});
    }

    return response.status(200).json({Mcqs});
}


const getById = async(req,res,next) =>{
    const id = req.params.id;

    let Mcqs;

    try{
        Mcqs = await Mcq.findById(id);
    }catch(err){
        console.log(err);
    }

    if (!Mcqs) {
        return res.status(404).json({ message: "Mcq not found" }); 
    }

    return res.status(200).json({ Mcqs });
}



const updateMcq = async (req, res, next) => {
    const id = req.params.id;
    const {question,clName,options,correctAnswer} = req.body;

    let Mcqs;

    try{
        Mcqs = await Mcq.findByIdAndUpdate(id, {question:question,clName:clName,options:options, correctAnswer:correctAnswer});

        Mcqs = await Mcq.save();
    }catch(err){
        console.log(err);
    }

    if (!Mcqs) {
        return res.status(404).json({ message: "Unable to update Mcq" }); 
    }

    return res.status(200).json({ Mcqs });
}

const deleteMcq = async (req, res, next) => {
    const id = req.params.id;

    let Mcqs;

    try{
        Mcqs = await Mcq.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }

    if (!Mcqs) {
        return res.status(404).json({ message: "Unable to delete user" }); 
    }

    return res.status(200).json({ Mcqs });
}

exports.getAllMcqs = getAllMcqs;
exports.addMcq = addMcq;
exports.getById = getById;
exports.updateMcq = updateMcq;
exports.deleteMcq = deleteMcq;