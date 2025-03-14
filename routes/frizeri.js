import express from 'express'
import { db } from '../server.js'
import { ObjectId } from 'mongodb'


const frizeri = express.Router()

frizeri.get('/api/frizeri', async (req, res) => {
  let frizeri_collection = db.collection('Frizeri')
  let sviFrizeri = await frizeri_collection.find().toArray()
  res.status(200).json(sviFrizeri)

  if (!sviFrizeri) {
    res.status(400).json("Frizeri nisu dohvacene", error.message )
  }
})



frizeri.post('/api/frizeri', async (req, res) => {
  const { ime, prezime, iskustvo } = req.body

 

  if (!ime) {
    return res.status(404).json('Niste unijeli ime')
  }

  if (!prezime) {
    return res.status(404).json('Niste unijeli prezime')
  }

  if (!iskustvo) {
    return res.status(404).json('Niste unijeli iskustvo')
  }

  let baza = db.collection('Frizeri')

  try {
    const noviFrizer = {
      ime,
      prezime,
      iskustvo, 
    }

    const postojiFrizer = await baza.findOne({ ime })
    if (postojiFrizer) {
      return res.status(404).json({ message: 'Frizer vec postoji' })
    }

    await baza.insertOne(noviFrizer)
    res.status(201).json({ message: `Frizer ${ime} ${prezime} je kreiran` })
  } catch (error) {
    res.status(400).json('Doslo je do greske', error.message)
  }
})


frizeri.delete('/api/frizeri/:id', async (req, res) => {
  const id = new ObjectId(req.params.id) 
  try {
    let baza = db.collection('Frizeri')

    const result = await baza.findOne({_id: id})
     await baza.deleteOne(result)
    res.status(200).json({message: "Korisnik je izbrisan!"})
  } catch (error) {
    res.status(400).json("Doslo je do greske", error.message)
  }
})

export default frizeri
