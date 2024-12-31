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
    const { email } = req.body; 
    if (!email) {
      return res.status(400).json({ message: "Email je obavezan" }); 
    }
  
    const baza = db.collection('Termini');
  
    try {
      const noviTermin = {
        email,
        
      };
  
      const rezultat = await baza.insertOne(noviTermin);
  
      res.status(201).json({ message: "Termin uspesno kreiran" });
    } catch (error) {
      res.status(500).json({ message: "Doslo je do greske", error: error.message });
    }
  });
  



export default termini