const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    admin : {
        type: String,
        required: true,
        trim: true,
    }
    
  },{ timestamps: true });
  
let toolColl = mongoose.model("Tools",toolSchema); //create Tools schema/table

// API save Tools record in collection/table
const savetool = async (req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    const { name,admin } = req.body;
    toolColl.findOne({ name: name }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'Tools already exist.' });
        }
        else {
            toolColl.create(req.body).then((data)=>{
                res.send({ status: 200, name: data.name, admin: data.admin, _id: data._id, message: "You have save tools successfully" });
            }).catch((err)=>{
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })
    
};

// API all record from Tools collection/table
const getAllTool = async (req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    toolColl.find().then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        res.send(err);
    })
};

// API single record from Tools collection/table using id
const getToolsById=async(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("req.body",req.params.id);
    toolColl.findById({_id: req.params.id}).then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        res.send(err);
    })
}

// API delete single record from Tools collection/table
const deleteTools = async(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("req.body",req.params);
    toolColl.deleteOne({_id: req.params.id}).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err);
    })
    
}

// API update single record in Tools collection/table
const editTools =async(req,res) =>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log(req.body.id);
    toolColl.findOne({ name: req.body.name }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'Tools already exist.' });
        }
        else {
            toolColl.findOneAndUpdate({_id: req.body.id},{name:req.body.name, admin: req.body.admin},{
                new: true
              }).then((data)=>{
                res.send({ status: 200, name: data.name, admin: data.admin, _id: data._id, message: "You have update tools successfully" });
            }).catch((err)=>{
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })
    
}


module.exports = {
    savetool,
    getAllTool,
    getToolsById,
    deleteTools,
    editTools
}
