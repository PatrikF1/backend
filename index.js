import express from "express"
import cors from "cors"
import korisnici from "./routes/korisnici.js"
import usluge from "./routes/usluge.js"
import frizeri from "./routes/frizeri.js"
import termini from "./routes/termini.js"
import router from "./uploadImage.js"


const PORT = 3000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend radi')
})


app.use('/', korisnici)
app.use('/', usluge)
app.use('/', frizeri)
app.use('/', termini)
app.use('/', router)




app.listen(PORT, error => {
  if (error) {
    console.log('Greška prilikom pokretanja servera', error)
  }
  console.log(`SharpApp poslužitelj dela na http://localhost:${PORT}`)
})