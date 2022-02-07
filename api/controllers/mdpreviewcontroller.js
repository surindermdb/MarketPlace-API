const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const previewSchema = new mongoose.Schema({
    
    image : {
        type: String,
        required: true,
        trim: true,
    },
    productid : {
        type: Schema.Types.ObjectId, ref:'Product'
    },
},{ timestamps: true });

let previewColl = mongoose.model("Preview",previewSchema);

// API upload product preview file in productpreview collection/table
const uploadPreview=(req,res)=>{
    const { productid } = req.body;
    console.log(productid);
    console.log(req.files.length);
    previewColl.deleteMany({productid: productid}).then((data)=>{
        console.log(data);
        if(data.ok>0){
            let preloaddata=[];
            for(let i=0;i<req.files.length;i++){
                let imageurl=req.files[i].filename;
                console.log("file name : "+imageurl);
                var loadData={productid:productid,image:imageurl};
                previewColl.create(loadData).then((result)=>{
                    console.log(result);
                    preloaddata.push(result);
                    if(req.files.length===preloaddata.length){
                        res.send({ status: 200, previewloaddata: preloaddata, message: "You have save preview successfully" });
                    }
                    
                }).catch((err)=>{
                    res.send(err);
                })
            }
            // res.send(preloaddata)
            // res.send({ status: 200, previewdata: preloaddata, message: "You have save preview successfully" });
        }
        
    }).catch((err)=>{
        res.send(err);
    })
}


module.exports = {
    uploadPreview,
    previewColl
}