import express from 'express'
import { db } from '../server.js'
import { ObjectId } from 'mongodb'



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


korisnici.post('/api/registration', async (req, res) => {
    const {username, email, password, repeat_password} = req.body

    if(password !== repeat_password){
        return res.status(400).json("greska u prijavi, lozinka nije ista!") && alert("krivo ste unijeli lozinku!")
    }

    let baza = db.collection('Korisnici')

    try {
        
        const noviKorisnik = {
            username, 
            email, 
            password, 
            repeat_password
        }

        const kreiran = await baza.insertOne(noviKorisnik)
        res.status(201).json({message: `korisnik ${username} je kreiran`, id: kreiran.id})

    } catch(error) {
        res.status(400).json("Desila se greska prilikom unosa");
        console.log(error)
    }
    
})


export default korisnici