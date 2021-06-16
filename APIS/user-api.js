//create mini express app
const exp=require("express")
const userApi=exp.Router()

//import MongoClient
const mc=require("mongodb").MongoClient;

//connection string
const databaseUrl="mongodb+srv://sri_123:srivani@sri-cluster.sxij8.mongodb.net/sridb?retryWrites=true&w=majority";

let databaseObj;

//connect DB
mc.connect(databaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    if(err)
        console.log("err in db connection ",err);
    else{
        //get database object
        databaseObj=client.db("sridb")
        console.log("connected to database")
    }
})

//sample route
userApi.get('/getusers',(req,res)=>{
    res.send({message:"response from userApi"})
})

//export this api
module.exports=userApi;