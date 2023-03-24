const express=require("express")
const app=express()
const cors=require("cors")
const mongoose=require("mongoose")
const Event=require("./models/Event")
const uri=`mongodb+srv://Suryakant:Suryadas@cluster0.mydbwj6.mongodb.net/EventScheduler?retryWrites=true&w=majority`
app.use(express.json())
app.use(cors())

mongoose.connect(uri)
.then(()=>{console.log("Connected to database sucessfully")})

app.get("/",(req,resp)=>{
    resp.send({msg:"ok"})
})

app.post("/v1/events",async(req,resp)=>{
    console.log(req.body)
    try{
        if(req.body.description.length>50){
          resp.status(400).send({"error":"Validation error:description length must be less than 50 "})
        }
        else{
            let newEvent=new Event(req.body);
            let result=await newEvent.save()
            resp.status(201).send(result)
        }
        

    }
    catch{
        if(!req.body.title){
            resp.status(400).send({"error":"Validation error:title is required"})
        }
        else if(!req.body.description){
            resp.status(400).send({"error":"Validation error:description is required"})
        }
        else if(!req.body.location){
            resp.status(400).send({"error":"Validation error:location is required"})
        }
        else if(!req.body.startTime){
            resp.status(400).send({"error":"Validation error:startTime is required"})
        }
        else if(!req.body.endTime){
            resp.status(400).send({"error":"Validation error:endTime is required"})
        }
    }
})

app.get("/v1/events",async(req,resp)=>{
    console.log(req.body)
    try{
        let result=await Event.find()
        resp.status(200).send(result)
    }
    catch{
        resp.status(404).send({msg:"Unable to load all data"})
    }
})

app.get("/v1/events/:id",async(req,resp)=>{
    console.log(req.body)
    try{
        let result=await Event.findOne({_id:req.params.id})
        resp.status(200).send(result)
    }
    catch{
        resp.status(404).send({"error":"There is no event with that id"})
    }
})

app.delete("/v1/events/:id",async(req,resp)=>{
    console.log(req.body)
    try{
        let result=await Event.deleteOne({_id:req.params.id})
        resp.status(204).send(result)
    }
    catch{
        resp.status(204).send()
    }
})

app.put("/v1/events/:id",async(req,resp)=>{
    try{
        if(!req.body.title){
            resp.status(400).send({"error":"Validation error:title is required"})
        }
        else if(!req.body.description){
            resp.status(400).send({"error":"Validation error:description is required"})
        }
        else if(!req.body.location){
            resp.status(400).send({"error":"Validation error:location is required"})
        }
        else if(!req.body.startTime){
            resp.status(400).send({"error":"Validation error:startTime is required"})
        }
        else if(!req.body.endTime){
            resp.status(400).send({"error":"Validation error:endTime is required"})
        }
        else{
            if(req.body.description.length>5){
                resp.status(400).send({"error":"Validation error:description length must be less than 50 "})
              }else{
                let result=await Event.updateOne({_id:req.params.id},{$set:req.body})
    
                let updatedResult=await Event.findOne({_id:req.params.id})
                resp.status(200).send(updatedResult)
              }
          
        }
    }
    catch{
       
    }
})



app.listen(5000,()=>{console.log("app is running on port 5000")})