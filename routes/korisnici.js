import express from 'express'
import { db } from '../server.js'



const korisnici = express.Router()




korisnici.get('/api/korisnici', async (req, res) => {
    
    let korisnci_collection = db.collection('Korisnici')
    let sviKorisnci = await korisnci_collection.find().toArray()
    res.status(200).json(sviKorisnci)

    if(!sviKorisnci){
    res.status(400).json({poruka: "Korisnici nisu dohvaceni", error})
    }
})


korisnici.post('/api/login', async (req, res) => {
    const {email, password} = req.body
    
    if(!email || !password) {
        return res.status(400).json("email i lozinka su obavezni!")
    }

    try {
        let baza = db.collection('Korisnici')

        const korisnik = await baza.findOne({email})

        if(!korisnik) {
            return res.status(400).json("korisnik ne postoji!")
        }

        if(korisnik.password !== password) {
            return res.status(401).json("kriva lozinka!")
        }

        res.status(200).json(email)
        
    } catch (error) {
        res.status(400).json("Desila se greska prilikom unosa korisnika!")
    }

    
})


export default korisnici