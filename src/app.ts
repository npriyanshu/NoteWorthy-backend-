import express from "express"
import db from "./data/dbs.js";
import userRoute from "./routers/user.js"
import { config } from "dotenv";
import {dirname} from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser"
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


// loading env files
config({
    path: `${__dirname}/data/config.env`,
    
})


const app = express();
// using middlewares
app.use(express.json()) // to access json data
app.use(cookieParser())
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    // "preflightContinue": false,
    // "optionsSuccessStatus": 204
  }))


// connecting database
db();

//  user routes
app.use("/user",userRoute);


app.get("/",(req,res)=>{

    res.send("<head><style>h1{color:red;}</style></head><h1>lol bhai jaan</h1>");

})
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port:",process.env.PORT);
})