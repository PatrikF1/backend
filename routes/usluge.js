import express from 'express'
import { db } from '../server.js'

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
        res.status(400).json("Doslo je do greske", error)
    }
})

export default usluge