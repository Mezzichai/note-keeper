import { Request, Response } from "express";
import { Collection, ObjectId,} from "mongodb"; // Import MongoDB types
import { db } from "../config/conn.js"

import { tryCatch } from "../middleware/higherOrder.js";
import { AppError } from "../middleware/appErr.js";

interface Note {
  _id: ObjectId;
  title: string;
  body: string;
}

interface Label {
  _id: ObjectId;
  title: string;
  notes?: Note[];
}

const getQuery = tryCatch(async (req: Request, res: Response) => {
  const {query} = req.params
  const notes: Collection<Note> | undefined = await db?.collection("notes")
  let results;

  results = await notes?.find({title: query})
  results = results?.limit(50).toArray()
  return res.send(results).status(200)
})

const getNote = tryCatch(async (req: Request, res: Response) => {
  const {id} = req.params
  const notes: Collection<Note> | undefined = await db?.collection("notes")
  let results;
  
  results = await notes?.find({_id: new ObjectId(id)})
  results = results?.limit(50).toArray()
  return res.send(results).status(200)
})

const getNotes = tryCatch(async (req: Request, res: Response) => {
    const {label} = req.params
    const notes: Collection<Note> | undefined = await db?.collection("notes")
    let results;
    if (label) {
      results = await notes?.find({Label: label})
    } else {
      throw new AppError(400, "label not found")
    }
    results = results?.limit(50).toArray()
    return res.send(results).status(200)
})


const postNote = tryCatch(async (req: Request, res: Response) => {
  const {label} = req.params

  const notes: Collection<Note> | undefined  = db?.collection("notes")
  const newDoc = req.body;
  newDoc.label = label
  newDoc.date = new Date();
  const result = await notes?.insertOne(newDoc)
  return res.send(result).status(200)
})


const patchNote = tryCatch(async (req: Request, res: Response) => { 
  const noteId = req.params.id;
  const updatedFields = req.body

  const notes: Collection<Note> | undefined= db?.collection("notes")

  const result = await notes?.findOneAndUpdate(
    {_id: new ObjectId(noteId)},
    {$set: updatedFields},
    {returnDocument: "after"}
  )

  if (result?.value) {
    return res.send(result.value).status(200)
  } else {
    throw new Error
  }
})

const deleteNote = tryCatch(async (req: Request, res: Response) => { 
  const noteId = req.params.id;

  const notes: Collection<Note> | undefined = db?.collection("notes")

  const result = await notes?.findOneAndDelete(
    {_id: new ObjectId(noteId)}
  )

  console.log(result?.value)
  return res.send(result?.value).status(200)

})


const getLabels = tryCatch(async (req: Request, res: Response) => {
  const labels: Collection<Label> | undefined = await db?.collection("labels")
  const results = await labels?.find({}).limit(50).toArray()
  return res.send(results).status(200)
})

const postLabel = tryCatch(async (req: Request, res: Response) => {
    const labels: Collection<Label> | undefined = db?.collection("labels")
    const newDoc = req.body
    console.log(newDoc)
    newDoc.date = new Date()
  
    const result = await labels?.insertOne(newDoc)
    return res.send(result).status(204)
})


const patchLabel = tryCatch(async (req: Request, res: Response) => {
  const labelId = req.params.id
  const updatedFields = req.body

  const labels: Collection<Label> | undefined = db?.collection("labels")

  const result = await labels?.findOneAndUpdate(
    {_id: new ObjectId(labelId)},
    {$set: updatedFields},
    {returnDocument: "after"}
  )
  return res.send(result).status(204)
})

const deleteLabel = async (req: Request, res: Response) => {
  const labelId = req.params.id

  const labels: Collection<Label> | undefined = db?.collection("labels")

  const result = await labels?.findOneAndDelete(
    {_id: new ObjectId(labelId)}

  )
  if (result?.value) {
    console.log(result?.value)
    return res.send(result.value).status(200)
  } 
}






export { getNotes, getNote, getQuery, postNote, patchNote, deleteNote, getLabels, postLabel, patchLabel, deleteLabel };
