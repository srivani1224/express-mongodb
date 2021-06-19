//create mini express app
const exp=require("express")
const userApi=exp.Router()
const expressErrorHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

//add body parsing middle ware
userApi.use(exp.json())

//import MongoClient
const mc=require("mongodb").MongoClient;

//connection string
const databaseUrl="mongodb+srv://sri_123:srivani@sri-cluster.sxij8.mongodb.net/sridb?retryWrites=true&w=majority";

let userCollectionObj;

//connect DB
mc.connect(databaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    if(err)
        console.log("err in db connection ",err);
    else{
        //get database object
        let databaseObj=client.db("sridb")
        //create usercollection obj
        userCollectionObj=databaseObj.collection("usercollection");
        console.log("connected to database")
    }
})


//http://localhost:3000/user/getusers
userApi.get("/getusers", expressErrorHandler( async (req,res)=>{

    //read docs from user collection
    let usersList = await userCollectionObj.find().toArray()
    res.send({message:usersList})

}))


//http://localhost:3000/user/getuser/<username>
userApi.get("/getuser/:username", expressErrorHandler( async (req,res)=>{

    //get username from urlparamas
    let un=req.params.username

    //search for user
    let userObj = await userCollectionObj.findOne({username:{$eq:un}})
    if(userObj==null)
        res.send({message:"user not found"})
    else
        res.send({message:userObj});

}))

//http://localhost:3000/user/createuser
userApi.post("/createuser", expressErrorHandler( async (req,res,next)=>{

    //get user Obj
    let newUser=req.body

    //check if user is already existed
    let userObj = await userCollectionObj.findOne({username:newUser.username})
    //if user not existed create new user
    if(userObj==null){
        //hash password
        let hashedpassword = await bcryptjs.hash(newUser.password,7);
        //replace password
        newUser.password = hashedpassword
        //insert user
        userCollectionObj.insertOne(newUser)
        console.log("User added successfully")
        res.send({message:"User added successfully"})
    }
    //if user existed already
    else{
        console.log("User existed already")
        res.send({message:"User existed already"})
    }

}))

//http://localhost:3000/user/updateuser/<username>
userApi.put("/updateuser/:username", expressErrorHandler( async (req,res)=>{

    //get new user
    let newUser = req.body;

    //update
    await userCollectionObj.updateMany({username:newUser.username},{$set:{...newUser}})
    console.log("User data updated")
    res.send({message:"User data updated"})

}))


// http://localhost:3000/user/deleteuser/<username>
userApi.delete('/deleteuser/:username', expressErrorHandler( async (req,res)=>{

    //get username from url params
    let userObj=req.params.username

    //deleteuser
    await userCollectionObj.deleteMany({username:userObj})
    console.log("User Deleted")
    res.send({message:"User Deleted"})
}))

// http://localhost:3000/user/login
userApi.post('/login', expressErrorHandler ( async (req,res) =>{

    //get usercredentials
    let credentials = req.body;

    //search for user
    let userObj = await userCollectionObj.findOne({username:credentials.username})
    //if user not found
    if(userObj == null){
        res.send({message:'Invalid Username'})
    }
    //if user existed
    else{
        //compare the password
        let result = await bcryptjs.compare(credentials.password ,userObj.password)
        //if no match
        if(result==false){
            res.send({message:'Inavlid Password'})
        }
        else{
            //create a token 
            let signedToken = jwt.sign({username:credentials.username},'abcdef',{expiresIn:120})
            //send token to client
            res.send({message:'login success',token: signedToken , username:credentials.username})
        }
    }

}))

//export this api
module.exports=userApi;