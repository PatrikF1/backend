import express from 'express'
import { db } from '../server.js'
import { comparePassword, hashPassword } from '../hashiranje.js'

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

    let baza = db.collection('Korisnici')

    try {

        const korisnik = await baza.findOne({email})

        if(!korisnik) {
            return res.status(404).json("korisnik ne postoji!")
        }

        const lozinkaIspravna = await comparePassword(password, korisnik.password)

        if(!lozinkaIspravna) {
            return res.status(401).json("kriva lozinka!")
        }

        res.status(200).json(email)
        
    } catch (error) {
        res.status(500).json("Desila se greska na serveru!")
    }
    
})


korisnici.post('/api/registration', async (req, res) => {
    const {username, email, password, repeat_password} = req.body

    if(password !== repeat_password){
        return res.status(400).json("Greska u prijavi, lozinka nije ista!") 
    }

    let baza = db.collection('Korisnici')


    try {
        
        const postojiKorisnik = await baza.findOne({email});
        if (postojiKorisnik) {
          return res.status(400).json({ message: "Email vec postoji" });
        }

        const hashed_password = await hashPassword(password, 10)

        if(!hashed_password){
        res.status(500).json("Doslo je do greske prilikom hashiranja lozinke")
        return
        }

        const noviKorisnik = {
            username, 
            email, 
            password: hashed_password, 
        }


        await baza.insertOne(noviKorisnik)
        res.status(201).json({message: `korisnik ${username} je kreiran`})

    } catch(error) {
        res.status(400).json("Desila se greska prilikom unosa");
        console.log(error)
    }
    
})


export default korisnici