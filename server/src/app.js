const dotenv = require("dotenv");
const express = require("express");

dotenv.config();
const app = express();

app.use("/",(req,res)=>{
    res.send("Server is running");
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on the port ${process.env.PORT} `);
});
