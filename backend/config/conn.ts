import { MongoClient, Db } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
console.log(connectionString)
// const clientOptions: MongoClientOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

let client: MongoClient | undefined;
let db: Db | undefined;

const connectToDatabase = async () => {
  try {
    client = await MongoClient.connect(connectionString);
    db = client.db();
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};


export { connectToDatabase, db };