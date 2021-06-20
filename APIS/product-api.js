//create mini express app
const exp=require("express")
const productApi=exp.Router()
const expressErrorHandler=require("express-async-handler")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")

//add body parsing middle ware
productApi.use(exp.json())

//import MongoClient
const mc=require("mongodb").MongoClient

//connection string
const databaseUrl="mongodb+srv://sri_123:srivani@sri-cluster.sxij8.mongodb.net/sridb?retryWrites=true&w=majority";

let productCollectionObj;

//connect to database
mc.connect(databaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    if(err)
        console.log("error in db connection ",err)
    else{
        //get database object
        let databaseObj=client.db("sridb")
        //get productCollectionObj object
        productCollectionObj=databaseObj.collection("productcollection")
        console.log("connected to database productApi")
    }
})

//http://localhost:3000/product/getproducts
productApi.get('/getproducts', expressErrorHandler( async (req,res)=>{

    let productsList = await productCollectionObj.find().toArray();
    res.send({message:productsList})

}))

//http://localhost:3000/product/getproduct/<productname>
productApi.get('/getproduct/:productname', expressErrorHandler( async (req,res)=>{
    //get product name from url params
    let pn = req.params.productname

    //search for product
    let productObj = await productCollectionObj.findOne({productname:pn})
    if(productObj==null){
        res.send({message:'product not found'})
    }
    else{
        res.send({message:productObj})
    }

}))

//http://localhost:3000/product/createproduct
productApi.post('/createproduct', expressErrorHandler( async(req,res)=>{

    let newProduct = req.body;

    let productObj = await productCollectionObj.findOne({productname:newProduct.productname})
    if(productObj!==null){
        res.send({message:'product already existed'})
    }
    else{
        //hash password
        let hashedpassword = await bcryptjs.hash(newProduct.password,7)
        //replace password
        newProduct.password=hashedpassword
        //insert product
        await productCollectionObj.insertOne(newProduct)
        res.send({message:'product added'})
    }

}))

//http://localhost:3000/product/updateproduct/<productname>
productApi.put('/updateproduct/:productname', expressErrorHandler( async (req,res)=>{
    //get new product
    let newProduct = req.body;

    //hash password
    let hashedpassword = await bcryptjs.hash(newProduct.password,7)
    //replace password
    newProduct.password=hashedpassword
    //update product
    await productCollectionObj.updateMany({productname:newProduct.productname},{$set:{...newProduct}})
    res.send({message:'product updated'})

}))

//http://localhost:3000/product/deleteproduct/<productname>
productApi.delete('/deleteproduct/:productname', expressErrorHandler( async (req,res)=>{
    //get product from url params
    let productObj = req.params.productname

    //delete product
    await productCollectionObj.deleteMany({productname:productObj})
    res.send({message:'product deleted'})

}))

//http://localhost:3000/product/login
productApi.post('/login', expressErrorHandler( async(req,res)=>{
    //get product credentials
    let credentials = req.body

    //find if product existed
    let productObj = await productCollectionObj.findOne({productname:credentials.productname})
    if(productObj==null){
        res.send({message:'Invalid productname'})
    }
    else{
        let result = await bcryptjs.compare(credentials.password,productObj.password)
        if(result==false){
            res.send({message:'Invalid password'})
        }
        else{
            //create a token
            let signedToken = jwt.sign({productname:credentials.productname},'abdef', {expiresIn:180})
            //send token to client
            res.send({message:'login success',token: signedToken, productname:credentials.productname})
        }
    }
}))

//export this api
module.exports=productApi;