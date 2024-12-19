import express from "express"
import { connectToDatabase } from "./server.js"
import cors from "cors"
import bodyParser from "body-parser"

const app = express()

app.use(cors())
app.use(bodyParser.json())



const db = await connectToDatabase()

app.use(express.json())

const PORT = 3000


app.get('/rezervacije', async (req, res) => {
    let rezervacije_collection = db.collection('Rezervacije') 
    let allRezervacije = await rezervacije_collection.find().toArray() 
    res.status(200).json(allRezervacije)
  })





app.listen(PORT, error => {
  if (error) {
    console.log('Greška prilikom pokretanja servera', error)
  }
  console.log(`SharpApp poslužitelj dela na http://localhost:${PORT}`)
})