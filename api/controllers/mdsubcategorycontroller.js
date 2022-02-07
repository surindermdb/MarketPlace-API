const { request } = require('express');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const subcategorySchema = new mongoose.Schema({
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
    },
    category:{
        type: Schema.Types.ObjectId, ref:'Category'
    },
  },{ timestamps: true });
  
let subcategoryColl = mongoose.model("Subcategory",subcategorySchema) //create schema/table of Subcategory

// API get all record of subcategory collection/table
const getAllsubcategory = async (request,res)=>{
    const token = request.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    // populate function used to get category data
    subcategoryColl.find().populate("category").then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        res.send(err);
    })
};

// API save subcategory record in collection/table
const savesubcategory= async (req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("req.body",req.body);

    subcategoryColl.findOne({ name: req.body.name, category: req.body.category }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'SubCategory already exist.' });
        }
        else {
            subcategoryColl.create(req.body).then((data) => {
                res.send({ status: 200, name: data.name, admin: data.admin, _id: data._id, message: "You have save subcategory successfully" });
            }).catch((err) => {
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })
    // subcategoryColl.create(req.body).then((data)=>{
    //     res.send(data)
    // }).catch((err)=>{
    //     res.send(err);
    // })
}

// API delete single record of subcategory collection/table
const deletesubcategory=async(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("req.body",req.body);
    subcategoryColl.deleteOne({_id: req.params.id}).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err);
    })
}

// API get singlerecord of subcategory collection/table
const getsubcategorybyid= async(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("req.body",req.params.id);
    subcategoryColl.findById({_id: req.params.id}).then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        res.send(err);
    })
}

// API update/modify subcategory record in collection/table
const editsubcategory =async(req,res)=>{
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("req.body",req.body);
    subcategoryColl.findOne({ name: req.body.name, category: req.body.categoryid }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'SubCategory already exist.' });
        }
        else {
            subcategoryColl.findOneAndUpdate({_id: req.body.id},{name:req.body.name, admin: req.body.admin, categoryid: req.body.categoryid},{
                new: true
              }).then((data)=>{
                res.send({ status: 200, name: data.name, admin: data.admin, _id: data._id, message: "You have update subcategory successfully" });
                // res.status(200).send(data)
            }).catch((err)=>{
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })
    
}

module.exports = {
    getAllsubcategory,
    savesubcategory,
    deletesubcategory,
    getsubcategorybyid,
    editsubcategory
}