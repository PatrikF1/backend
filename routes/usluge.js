import express from 'express'
import { db } from '../server.js'
import { ObjectId } from 'mongodb'

const usluge = express.Router()

usluge.get('/api/usluge', async (req, res) => {
    
    let usluge_collection = db.collection('Usluge')
    let sveUsluge = await usluge_collection.find().toArray()
    res.status(200).json(sveUsluge)

    if(!sveUsluge){
    res.status(400).json({poruka: "Usluge nisu dohvacene", error})
    }
})

usluge.post ('/api/usluge', async (req, res) => {
    const {usluga, cijena, trajanje} = req.body

    if(!usluga) {
        return res.status(404).json("Niste unijeli uslugu")
    }

    if(!cijena) {
        return res.status(404).json("Niste unijeli cijenu")
    }

    if(!trajanje) {
        return res.status(404).json("Niste unijeli trajanje")
    }

    let baza = db.collection('Usluge')

    try {
        
        const novaUsluga = {
            usluga,
            cijena,
            trajanje
        }

        const postojiUsluga = await baza.findOne({usluga})
        if(postojiUsluga) {
            return res.status(400).json({ message: "Usluga vec postoji" });
        }

        const kreiran = await baza.insertOne(novaUsluga)
        res.status(201).json({message: `Usluga ${usluga} je kreirana`})


    } catch (error) {
        res.status(500).json("Doslo je do greske na serveru", error)
    }
})

usluge.delete('/api/usluge/:id', async (req, res) => {
  const id = new ObjectId(req.params.id) 
  try {
    let baza = db.collection('Usluge')

     await baza.deleteOne({_id: id})
    res.status(200).json({message: "Usluga je izbrisana!"})
  } catch (error) {
    res.status(500).json("Doslo je do greske na serveru", error.message)
  }
})

usluge.patch('/api/usluge/:id', async (req, res) => {
  const id = new ObjectId(req.params.id)
  const { cijena, trajanje } = req.body
  try {
    let baza = db.collection('Usluge')
    
     await baza.updateOne({_id: id}, {$set: {
        cijena: cijena, 
        trajanje: trajanje
    }})
    res.status(200).json("cijena i trajanje su promijenjeni")
  } catch (error) {
    res.status(500).json("Doslo je do greske na serveru", error.message)
  }
})

export default usluge