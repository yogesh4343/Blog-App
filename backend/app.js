// console.log("Hello wrld");
// import express from "express"
// import mongoose from "mongoose"
// import router from "./routes/user-routes"

const express = require("express")
const mongoose = require("mongoose")
const blogRouter = require("./routes/blog-routes")
const router = require("./routes/user-routes")
const cors = require('cors')
const dotenv = require('dotenv');


const app = express()

dotenv.config({path : './config.env'})

app.use(cors({credentials: true , origin:"https://monumental-capybara-0e3c1a.netlify.app"}))

// console.log(app)

// app.use("/api",(req,res,next)=>{
//     res.send("Hello wrld")
// })
app.use(express.json())
// user 
app.use("/api/user", router)

// blog 
app.use("/api/blog" , blogRouter)



// 2nd step heroku 
const PORT = process.env.PORT 

// 3nd step heroku 

if ( process.env.NODE_ENV == "production"){

    app.use(express.static("client/build"));

    // const path = require("path");

    // app.get("*", (req, res) => {

    //     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

    // })


}



mongoose.connect(process.env.DB).then(()=>{
    app.listen(PORT)
}).then(()=>{
    console.log(`Connected to databse & listning on port ${PORT}`)
}).catch((error)=>{
    console.log(error)
})
// app.listen(4000);
