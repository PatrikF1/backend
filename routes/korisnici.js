import express from 'express'
import { db } from '../server.js'



const korisnici = express.Router()




korisnici.get('/', async (req, res) => {
    
    let korisnci_collection = db.collection('Korisnici')
    let sviKorisnci = await korisnci_collection.find().toArray()
    res.status(200).json(sviKorisnci)

    if(!sviKorisnci){
    res.status(400).json({poruka: "Korisnici nisu dohvaceni", error})
    }
})


korisnici.post('/', async (req, res) => {
    let noviKorisnik = req.body
    let baza = db.collection('Korisnici')

    let podaci = ["ime", "prezime", "email"]
    
    let provjera = podaci.every(p => noviKorisnik.hasOwnProperty(p))

    if(!provjera) {
        return res.status(400).json("nedostaju podaci")
    }

    try {
        let dodaj = await baza.insertOne(noviKorisnik)
        res.status(200).json(dodaj)
    } catch (error) {
        res.status(400).json("Desila se greska prilikom unosa korisnika!")
    }

    
})


export default korisnici