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
          bucketName: 'fs',
          
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
      res.status(200).json({message: "Slika je uspijesno dodana!", noviDodanFrizer})
      

    } catch (error) {
      res.status(400).json({message: "Greska pri dodavanju frizera"})
    }
  })

  router.get("/api/upload/:id", async (req, res) => {
    try {

        let baza = db.collection('fs.files')

        const fileId = new ObjectId(req.params.id);  
        const bucket = new GridFSBucket(baza, { bucketName: "fs" }); 

        
        const file = await baza.findOne({ _id: fileId });
        if (!file) {
            return res.status(404).json({ message: "Slika ne postoji" });
        }

        res.set("Content-Type", file.contentType);

        
        const downloadStream = bucket.openDownloadStream(fileId);
        downloadStream.pipe(res);

        
        downloadStream.on("error", (error) => {
            console.error("Greška pri streamanju slike:", error);
            res.status(500).json({ message: "Greska pri dohvacanju slike" });
        });

    } catch (error) {
        console.error("Greška:", error);
        res.status(400).json({ message: "Neispravan ID slike" });
    }
});


export default router