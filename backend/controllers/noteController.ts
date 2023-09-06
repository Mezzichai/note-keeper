import { Request, Response } from "express";
import { Collection, InsertOneResult, ObjectId } from 'mongodb';
import { db } from "../config/conn.js"

import { tryCatch } from "../middleware/higherOrder.js";
import { AppError } from "../middleware/appErr.js";

interface Note {
  _id: ObjectId;
  title: string;
  body: string;
}

interface Label {
  _id: ObjectId | string;
  title: string;
}

const getQuery = tryCatch(async (req: Request, res: Response) => {
  const {query} = req.params
  const notes: Collection<Note> | undefined = await db.collection("notes")
  let results;

  results = await notes?.find({title: query})
  results = results?.limit(50).toArray()
  return res.send(results).status(200)
})

const getNote = tryCatch(async (req: Request, res: Response) => {
  const {id} = req.params
  const notes: Collection<Note> | undefined = await db.collection("notes")
  let results;
  
  results = await notes?.find({_id: new ObjectId(id)})
  results = results?.limit(50).toArray()
  return res.send(results).status(200)
})

const getNotes = tryCatch(async (req: Request, res: Response) => {
    const label = JSON.parse(req.params.label) as Label
    const notes: Collection<Note> | undefined = await db.collection("notes")

    let plainNotes: Note[];
    let pinnedNotes: Note[];
    if (label) {
      if (label._id === "default") {
        if (label.title === "Archive") {
          plainNotes = await notes?.find({ isArchived: true }).limit(50).toArray();
          pinnedNotes = []
        } else if (label.title === "Trash") {
          plainNotes = await notes?.find({ isTrashed: true }).limit(50).toArray();
          pinnedNotes = []
        } else {
          pinnedNotes = await notes?.find({isPinned: true }).limit(50).toArray();
          plainNotes = await notes?.find({ isArchived: false, isTrashed: false }).limit(50).toArray();
        }
      } else {
        pinnedNotes = await notes?.find({ labels: { $elemMatch: { _id: label._id} }, isArchived: false, isTrashed: false }).limit(50).toArray();
        plainNotes = await notes?.find({ labels: { $elemMatch: { _id: label._id} }, isArchived: false, isTrashed: false }).limit(50).toArray();
      }
      return res.send({plainNotes, pinnedNotes}).status(200)
    } else {
      throw new AppError(400, "label not found")
    }
})



const postNote = tryCatch(async (req: Request, res: Response) => {
  const { label } = req.params;

  const notes: Collection<Note> | undefined = db.collection('notes');
  const newDoc = req.body;
  newDoc.labels = [];
  newDoc.labels.push(JSON.parse(label))
  newDoc.date = new Date();

  const result: InsertOneResult<Note> | undefined = await notes?.insertOne(newDoc);

  if (result) {
    const insertedNote: Note = {
      ...newDoc,
      _id: result.insertedId,
    };
    return res.status(201).json(insertedNote);
  } else {
    throw new Error('Failed to insert note');
  }
});

const patchNote = tryCatch(async (req: Request, res: Response) => { 
  const noteId = req.params.id;
  const updatedFields = req.body
  const notes: Collection<Note> | undefined = db.collection("notes")

  const result = await notes?.findOneAndUpdate(
    {_id: new ObjectId(noteId)},
    {$set: updatedFields},
    {returnDocument: "after"}
  )

  if (result?.value) {
    return res.send(result.value).status(200)
  } else {
    throw new AppError(400, "Could not update note")
  }
})

const deleteNote = tryCatch(async (req: Request, res: Response) => { 
  const noteId = req.params.id;

  const notes: Collection<Note> | undefined = db.collection("notes")

  const result = await notes?.findOneAndDelete(
    {_id: new ObjectId(noteId)}
  )
  if (result) {
    return res.send(result.value).status(200)
  } else {
    throw new AppError(400, "Could not delete note")
  }
})


const getLabels = tryCatch(async (req: Request, res: Response) => {
  const labels: Collection<Label> | undefined = await db.collection("labels")
  const results = await labels.find({}).limit(50).toArray()
  return res.send(results).status(200)
})

const postLabel = tryCatch(async (req: Request, res: Response) => {
    const labels: Collection<Label> | undefined = db.collection("labels")
    const newDoc = req.body
  
    const result: InsertOneResult<Label> | undefined = await labels?.insertOne(newDoc);
    if (result) {
      const insertedLabel: Label = {
        ...newDoc,
        _id: result.insertedId,
      };
      return res.status(200).json(insertedLabel)
    } else {
      throw new Error('Failed to insert Label');
    }
})


const patchLabel = tryCatch(async (req: Request, res: Response) => {
  const labelId = req.params.id
  const updatedFields = req.body

  const labels: Collection<Label> | undefined = db.collection("labels")

  const result = await labels?.findOneAndUpdate(
    {_id: new ObjectId(labelId)},
    {$set: updatedFields},
    {returnDocument: "after"}
  )
  return res.send(result).status(204)
})

const deleteLabel = async (req: Request, res: Response) => {
  const labelId = req.params.id

  const labels: Collection<Label> | undefined = db.collection("labels")

  const result = await labels?.findOneAndDelete(
    {_id: new ObjectId(labelId)}

  )
  if (result?.value) {
    console.log(result?.value)
    return res.send(result.value).status(200)
  } 
}






export { getNotes, getNote, getQuery, postNote, patchNote, deleteNote, getLabels, postLabel, patchLabel, deleteLabel };
