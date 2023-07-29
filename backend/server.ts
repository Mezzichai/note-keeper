import express, { Express } from "express";
import dotenv from "dotenv"
dotenv.config();
import { connectToDatabase }from "./config/conn.js";
import bodyParser from "body-parser";
import noteRoutes from "./routes/noteRoutes"

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHander.js";
import cors from 'cors'
import { credentials } from "./middleware/credentials.js";
import { corsOptions } from "./config/corsOptions.js";



const port = process.env.PORT
connectToDatabase()
const app: Express = express()


// the callback in app.get() will be invoked everytime a get req with 
// a path "/" relative to the root site
app.use(credentials)

app.use(cors(corsOptions))



app.use(bodyParser.json())

app.use("/notes", noteRoutes)

app.use(errorHandler)
app.use(notFound)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})