const mongoose = require('mongoose');
var { sliderColl } = require('./mdslidercontroller');
var { previewColl } = require('./mdpreviewcontroller');
var Schema = mongoose.Schema;


const productSchema = new mongoose.Schema({
    adminname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'Category'
    },
    highlight: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    overview: {
        type: String,
        required: true,
        trim: true,
    },
    sharelink: {
        type: String,
        required: true,
        trim: true,
    },
    subcategory: {
        type: Schema.Types.ObjectId, ref: 'Subcategory'
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    tools: {
        type: Schema.Types.ObjectId, ref: 'Tools'
    },
}, { timestamps: true });

let productColl = mongoose.model("Product", productSchema); //create model/schema using mongoose

// API Save product
const saveproduct = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    let data = {
        "adminname": req.body.admin, "category": req.body.category, "highlight": req.body.highlight,
        "image": req.file.filename, "overview": req.body.overview, "sharelink": req.body.link, "subcategory": req.body.subcategory, "title": req.body.title, "tools": req.body.tools
    }
    console.log(data);

    productColl.findOne({ title: req.body.title }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'Product already exist.' });
        }
        else {
            productColl.create(data).then((data) => {
                res.send({ status: 200, productdata: data, message: "You have save product successfully" });
            }).catch((err) => {
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })
}

// API List of all  product 
const getAllProduct = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("Get Product API call");
    productColl.find().populate('category').populate('subcategory').populate('tools').then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.send(err);
    })
}

// API Delete  product using product id
const deleteproduct = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("req.body", req.params);
    productColl.deleteOne({ _id: req.params.id }).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err);
    })
}

// API Get data of product using product id
const getproductbyid = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    console.log("Get Product API call by id");
    let data = { product: {}, productslider: [], productPreview: [] };
    // get data of main product collection/table
    productColl.findOne({ _id: req.params.productid }).then((resproduct) => {
        console.log(resproduct);
        if (resproduct) {
            data.product = resproduct;
            console.log("success Product data");
            // get data of product slider by productid collection/table
            sliderColl.find({ productid: req.params.productid }).then((slider) => {
                console.log("success slider data");
                if (slider.length > 0) {
                    for (let i = 0; i < slider.length; i++) {
                        data.productslider.push(slider[i]);
                    }
                }
                // get data of product preview by productid collection/table
                previewColl.find({ productid: req.params.productid }).then((preview) => {
                    console.log("success preview data");
                    if (preview.length > 0) {
                        for (let j = 0; j < preview.length; j++) {
                            data.productPreview.push(preview[j]);
                        }
                        return res.status(200).send(data);
                    }
                    else {
                        return res.status(200).send(data);
                    }
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            })
        }

    }).catch((err) => {
        res.send(err);
    })
}

const modify = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'unauthorized user.' });
    }
    const { id } = req.body;
    console.log(id);
    console.log(req.file);
    let data;

    if (req.file != undefined) {
        data = {
            "adminname": req.body.admin, "category": req.body.category, "highlight": req.body.highlight,
            "image": req.file.filename, "overview": req.body.overview, "sharelink": req.body.link, "subcategory": req.body.subcategory, "title": req.body.title, "tools": req.body.tools
        }
        console.log(data);
    }
    else {
        data = {
            "adminname": req.body.admin, "category": req.body.category, "highlight": req.body.highlight, "overview": req.body.overview, "sharelink": req.body.link,
            "subcategory": req.body.subcategory, "title": req.body.title, "tools": req.body.tools
        }
        console.log(data);
    }
    productColl.findOne({ title: req.body.title, _id: {$ne : id} }).then(function (result) {
        if (result) {
            return res.send({ status: 401, message: 'Product already exist.' });
        }
        else {
            productColl.findOneAndUpdate({_id:id},data).then((data) => {
                res.send({ status: 200, productdata: data, message: "You have update product successfully" });
            }).catch((err) => {
                res.send(err);
            })
        }
    }).catch((err) => {
        res.send(err);
    })
    
}

module.exports = {
    saveproduct,
    getAllProduct,
    deleteproduct,
    getproductbyid,
    modify
}