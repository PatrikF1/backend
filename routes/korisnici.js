import express from 'express'

const korisnici = express.Router()



korisnici.get('/korisnici', async (req, res) => {
    let korisnci_collection = db.collection('Korisnici')
    let sviKorisnci = await korisnci_collection.find().toArray()
    res.status(200).json(sviKorisnci)
})


export default korisnici