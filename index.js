import express from "express"
import cors from "cors"
import korisnici from "./routes/Korisnici.js"


const PORT = 3000

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', korisnici)






app.listen(PORT, error => {
  if (error) {
    console.log('Greška prilikom pokretanja servera', error)
  }
  console.log(`SharpApp poslužitelj dela na http://localhost:${PORT}`)
})