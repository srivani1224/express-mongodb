//create mini express app
const exp=require("express")
const userApi=exp.Router()
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

/*http://localhost:3000/user/getusers
userApi.get("/getusers",(req,res,next)=>{

    //read docs from user collection
    userCollectionObj.find().toArray((err,usersList)=>{

        if(err){
            console.log("err in getting usersList",err)
            res.send({message:err.message});
        }
        else{
            res.send({message:usersList});
        }

    });


})

//http://localhost:3000/user/getusers
userApi.get("/getusers",(req,res,next)=>{

    //read docs from user collection
    userCollectionObj.find().toArray().
        then(usersList=>{res.send({message:usersList})}).
        catch(err=>{
            console.log("err in getting usersList",err)
            res.send({message:err.message});
        })


})*/

//http://localhost:3000/user/getusers
userApi.get("/getusers", async (req,res,next)=>{

    //read docs from user collection
    let usersList = await userCollectionObj.find().toArray()
    res.send({message:usersList})

})

/*http://localhost:3000/user/getuser/<username>
userApi.get("/getuser/:username",(req,res,next)=>{

    //get username from urlparamas
    let un=req.params.username

    //search for user
    userCollectionObj.findOne({username:{$eq:un}},(err,userObj)=>{
        
        //if error
        if(err){
            console.log("err in getting user by username",err)
            res.send({message:err.message});
        }

        else{

            //if user not found
            if(userObj===null)
                res.send({message:"user not found"})

            //if user found 
            else
                res.send({message:userObj});
        }
    });

})

//http://localhost:3000/user/getuser/<username>
userApi.get("/getuser/:username",(req,res,next)=>{

    //get username from urlparamas
    let un=req.params.username

    //search for user
    userCollectionObj.findOne({username:{$eq:un}}).
        then(userObj=>{
            if(userObj==null)
                res.send({message:"user not found"})
            else
                res.send({message:userObj});
        }).
        catch(err=>{
            console.log("err in getting user by username",err)
            res.send({message:err.message});
        })

})*/

//http://localhost:3000/user/getuser/<username>
userApi.get("/getuser/:username", async (req,res,next)=>{

    //get username from urlparamas
    let un=req.params.username

    //search for user
    let userObj = await userCollectionObj.findOne({username:{$eq:un}})
    if(userObj==null)
        res.send({message:"user not found"})
    else
        res.send({message:userObj});

})


/*http://localhost:3000/user/createuser
userApi.post("/createuser",(req,res,next)=>{

    //get user Obj
    let newUser=req.body

    //check if user is already existed
    userCollectionObj.findOne({username:newUser.username},(err,userObj)=>{

        if(err){
            console.log("error in finding during creating user ",err)
            res.send({message:err.message})
        }
        else{
            //if user not existed create new user
            if(userObj===null){
                userCollectionObj.insertOne(newUser,(err,success)=>{

                    if(err){
                        console.log("error in creating user ",err)
                        res.send({message:err.message})
                    }
                    else{
                        console.log("User added successfully")
                        res.send({message:"User added successfully"})
                    }
                })
            }
            //if user existed already
            else{
                console.log("User existed already")
                res.send({message:"User existed already"})
            }
        }

    })

})

//http://localhost:3000/user/createuser
userApi.post("/createuser",(req,res,next)=>{

    //get user Obj
    let newUser=req.body

    //check if user is already existed
    userCollectionObj.findOne({username:newUser.username}).
        then(userObj=>{
            //if user not existed create new user
            if(userObj==null){
                userCollectionObj.insertOne(newUser)
                console.log("User added successfully")
                res.send({message:"User added successfully"})
            }
            //if user existed already
            else{
                console.log("User existed already")
                res.send({message:"User existed already"})
            }
        }).
        catch(err=>{
            console.log("error in creating user ",err)
            res.send({message:err.message})
        })

})*/

//http://localhost:3000/user/createuser
userApi.post("/createuser", async (req,res,next)=>{

    //get user Obj
    let newUser=req.body

    //check if user is already existed
    let userObj = await userCollectionObj.findOne({username:newUser.username})
    //if user not existed create new user
    if(userObj==null){
        userCollectionObj.insertOne(newUser)
        console.log("User added successfully")
        res.send({message:"User added successfully"})
    }
    //if user existed already
    else{
        console.log("User existed already")
        res.send({message:"User existed already"})
    }

})

/*http://localhost:3000/user/updateuser/<username>
userApi.put("/updateuser/:username",(req,res,next)=>{

    //get user from url params
    let newUser=req.body

    //update user
    userCollectionObj.updateMany({username:newUser.username},{
            $set:{
                //email:newUser.email,
                //city:newUser.city,
                //age:newUser.age
                ...newUser
            }
            },(err,success)=>{

                if(err){
                    console.log("error in updating user ",err)
                    res.send({message:err.message})
                }
                else{
                    console.log("User data updated")
                    res.send({message:"User data updated"})
                }
    })
})


//http://localhost:3000/user/updateuser/<username>
userApi.put("/updateuser/:username",(req,res,next)=>{

    //get user from url params
    let newUser=req.body

    //update user
    userCollectionObj.updateMany({username:newUser.username},{$set:{ ...newUser }}).
        then(success=>{
            console.log("User data updated")
            res.send({message:"User data updated"})
        }). 
        catch(err=>{
            console.log("error in updating user ",err)
            res.send({message:err.message})
        })
})*/

//http://localhost:3000/user/updateuser/<username>
userApi.put("/updateuser/:username", async (req,res,next)=>{

    //get new user
    let newUser = req.body;

    //update
    await userCollectionObj.updateMany({username:newUser.username},{$set:{...newUser}})
    console.log("User data updated")
    res.send({message:"User data updated"})

})


/* http://localhost:3000/user/deleteuser/arun
userApi.delete('/deleteuser/:username',(req,res,next)=>{

    //get username from url paramas
    let userObj=req.params.username

    //delete user
    userCollectionObj.deleteMany({username:userObj},(err,success)=>{
        if(err){
            console.log("error in deleting user ",err)
            res.send({message:err.message})
        }
        else{
            console.log("User Deleted")
            res.send({message:"User Deleted"})
        }
    })
})

// http://localhost:3000/user/deleteuser/arun
userApi.delete('/deleteuser/:username',(req,res,next)=>{

    //get username from url paramas
    let userObj=req.params.username

    //delete user
    userCollectionObj.deleteMany({username:userObj}).
        then(success=>{
            console.log("User Deleted")
            res.send({message:"User Deleted"})
        }).
        catch(err=>{
            console.log("error in deleting user ",err)
            res.send({message:err.message})
        })
})*/

// http://localhost:3000/user/deleteuser/<username>
userApi.delete('/deleteuser/:username', async (req,res,next)=>{

    //get username from url params
    let userObj=req.params.username

    //deleteuser
    await userCollectionObj.deleteMany({username:userObj})
    console.log("User Deleted")
    res.send({message:"User Deleted"})
})








//sample route
userApi.get('/getusers',(req,res)=>{
    res.send({message:"response from userApi"})
})

//export this api
module.exports=userApi;