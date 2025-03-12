import express from 'express'
import { db } from '../server.js'
import { storage } from '../slike.js'
import { upload } from '../slike.js'

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
  const { ime, prezime, iskustvo, slika } = req.body

 

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
      slika
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

frizeri.patch('/api/frizeri/:ime/:prezime', async (req, res) => {
  let baza = db.collection('Frizeri')
  let ime_param = req.params.ime
  let prezime_param = req.params.prezime
  let iskustvo_param = req.body.iskustvo

  if (!ime_param || !prezime_param || !iskustvo_param) {
    return res.status(400).json({ message: 'Svi podaci su obavezni!' })
  }

  try {
    let nadogradi = await baza.updateOne(
      { ime: ime_param, prezime: prezime_param },
      { $set: { iskustvo: iskustvo_param } }
    )

    if (nadogradi.modifiedCount === 0) {
      return res.status(404).json('Nije dohvaceno iskustvo')
    }

    res.status(200).json({ modifiedCount: nadogradi.modifiedCount })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Doslo je do greske', error: error.message })
  }
})

export default frizeri
