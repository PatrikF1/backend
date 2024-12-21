import express from "express"
import { connectToDatabase } from "./server.js"
import cors from "cors"
import bodyParser from "body-parser"
import korisnici from "./routes/Korisnici.js"

const db = await connectToDatabase()

const PORT = process.env.VUE_BACKEND_URL

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())

app.use('/', korisnici)






app.listen(PORT, error => {
  if (error) {
    console.log('Greška prilikom pokretanja servera', error)
  }
  console.log(`SharpApp poslužitelj dela na http://localhost:${PORT}`)
})