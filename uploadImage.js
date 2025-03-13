import express from 'express'
import multer from 'multer'
import { db } from './server.js'
import { GridFSBucket } from 'mongodb'
import { GridFsStorage } from 'multer-gridfs-storage'

const router = express.Router()



const storage = new GridFsStorage({
    db,
    file: (req, file) => {
      if (file.mimetype === 'image/jpeg') {
        return {
          filename: file.originalname,
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

    res.status(200).json({message: "Slika je uspijesno dodana!"})
  })


export default router