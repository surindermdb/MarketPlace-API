const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const markertplaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        unique: true
    },
    admin: {
        type: String,
        required: true,
        trim: true,
    }

});

let categoryColl = mongoose.model("Category", markertplaceSchema) //create model/schema using mongoose

// API Get data of category collection/table
const getAll = async (request, res) => {

    const token = request.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    categoryColl.find().then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.send(err);
    })
};

// API Save data of category collection/table
const savecategory = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    categoryColl.findOne({ name: req.body.name }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'Category already exist.' });
        }
        else {
            categoryColl.create(req.body).then((data) => {
                res.send({ status: 200, name: data.name, admin: data.admin, _id: data._id, message: "You have save category successfully" });
            }).catch((err) => {
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })
}

// API Delete single record of category collection/table
const deletecategory = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    categoryColl.deleteOne({ _id: req.params.id }).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err);
    })
}

// API get single record of category by id collection/table
const getcategorybyid = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    categoryColl.findById({ _id: req.params.categoryid }).then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.send(err);
    })
}

// API Update single record of category collection/table
const edit = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }

    categoryColl.findOne({ name: req.body.name }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'Category already exist.' });
        }
        else {
            categoryColl.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name, admin: req.body.admin }, {
                new: true
            }).then((data) => {
                res.send({ status: 200, name: data.name, admin: data.admin, _id: data._id, message: "You have update category successfully" });
                // res.status(200).send(data)
            }).catch((err) => {
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })

    
}

module.exports = {
    getAll,
    savecategory,
    deletecategory,
    getcategorybyid,
    edit
}