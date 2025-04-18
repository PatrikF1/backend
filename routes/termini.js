import express from 'express'
import { db } from '../server.js'


const termini = express.Router()

termini.get('/api/termini', async(req, res) => {
    const baza = db.collection('Termini')
try {
    let termin = await baza.find().toArray()
    res.status(200).json(termin)
} catch (error) {
    res.status(400).json({message: "Doslo je do greske", error: error.message})
}

})


termini.post('/api/termini', async (req, res) => {
  const { korisnik, frizer, usluga, datum } = req.body;

  const baza = db.collection('Termini')

  try {

    const postoji = await baza.findOne({
      frizer: frizer,
      datum: datum
    })

    if(postoji) {
      return res.status(409).json({message: "Taj termin je vec zauzet"})
    }

    const novaRezervacija = {
      korisnik,
      frizer,
      usluga,
      datum,
    };

    const rezultat = baza.insertOne(novaRezervacija);
    res.status(201).json({ message: "Termin uspjesno spremljen", rezultat });
  } catch (error) {
    res.status(500).json({ message: "Greska prilikom spremanja termina", error: error.message });
  }
});



export default termini