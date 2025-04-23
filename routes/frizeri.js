import express from 'express'
import { db } from '../server.js'
import { ObjectId } from 'mongodb'


const frizeri = express.Router()

frizeri.get('/api/frizeri', async (req, res) => {
  let frizeri_collection = db.collection('Frizeri')
  let sviFrizeri = await frizeri_collection.find().toArray()
  res.status(200).json(sviFrizeri)

  if (!sviFrizeri) {
    res.status(500).json("Frizeri nisu dohvacene", error.message )
  }
})



frizeri.delete('/api/frizeri/:id', async (req, res) => {
  const id = new ObjectId(req.params.id) 
  try {
    let baza = db.collection('Frizeri')

     await baza.deleteOne({_id: id})
    res.status(200).json({message: "Korisnik je izbrisan!"})
  } catch (error) {
    res.status(400).json("Doslo je do greske", error.message)
  }
})



frizeri.patch('/api/frizeri/:id', async (req, res) => {
  const id = new ObjectId(req.params.id)
  const { iskustvo } = req.body
  try {
    let baza = db.collection('Frizeri')
    
     await baza.updateOne({_id: id}, {$set: {iskustvo: iskustvo}})
    res.status(200).json("Iskustvo je promijenjeno")
  } catch (error) {
    res.status(400).json("Doslo je do greske", error.message)
  }
})

export default frizeri
