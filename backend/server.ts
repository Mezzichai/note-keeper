import express, { Express } from "express";
import path from "path";
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


async function startServer() {
  const port = process.env.PORT
  await connectToDatabase()
  const app: Express = express()

  console.log(__dirname)
  app.use(express.static(path.resolve(__dirname, "./build")));

  // the callback in app.get() will be invoked everytime a get req with 
  // a path "/" relative to the root site
  app.use(credentials)
  
  app.use(cors(corsOptions))
  
  
  
  app.use(bodyParser.json())
  app.use("/notes", noteRoutes)
  
  app.get("/", (req, res) => {
    res.send("Hello, this is the root endpoint!");
  });
  
  app.use(errorHandler)
  app.use(notFound)
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  })
}

startServer()
