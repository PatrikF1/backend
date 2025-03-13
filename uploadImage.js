import express from 'express'
import multer from 'multer'
import { db } from './server.js'
import { GridFSBucket, ObjectId } from 'mongodb'
import { GridFsStorage } from 'multer-gridfs-storage'

const router = express.Router()



const storage = new GridFsStorage({
    db,
    file: (req, file) => {
      if (file.mimetype === 'image/jpeg') {
        return {
          filename: 'file_' + Date.now(),
          metadata: { fieldName: file.fieldname },
          bucketName: 'uploads',
          
        };
      } else {
        return null;
      }
    }
  });

  const upload = multer({ storage });
  
 

router.post('/api/upload',upload.single('file'), async (req, res) => {
    if(!req.file) {
        return res.status(400).json({message: "Nema dodane slike"})
    }

    const {ime, prezime, iskustvo} = req.body
    let baza = db.collection('Frizeri')

    try {

      const noviDodanFrizer = {
        ime,
        prezime,
        iskustvo,
        slikaId: req.file.id
      }

      await baza.insertOne(noviDodanFrizer)
      res.status(200).json({message: "Slika je uspijesno dodana!"})

    } catch (error) {
      res.status(400).json({message: "Greska pri dodavanju frizera"})
    }
  })

  router.get('/api/upload/:id', async (req, res) => {
    try {
      const fileId = new ObjectId(req.params.id)
      const bucket = new GridFSBucket(db, {bucketName: 'uploads'})
      
      const preuzimanje = bucket.openDownloadStream(fileId)
      preuzimanje.on('error', () => {
        res.status(404).json({message: "Slika nije pronadena"})
      })

      res.set('Content-type', 'image/jpeg')
      preuzimanje.pipe(res)
    } catch (error) {
      res.status(400).json({message: "Greska pri dohvacanju slike"})
    }
  })

export default router