import express from 'express';
import { config } from 'dotenv';
import passport from 'passport';
import { router } from './router/routes.js'
import { jwtPass } from './middleware/passport.js'
import cors from 'cors';
import cookieParser from 'cookie-parser'
config()

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));




const start = async () => {
  try {

    const PORT = process.env.PORT
    const app = express()
    app.use(cors({ credentials: true, origin: ['https://page-builder.netlify.app', process.env.SITE_URL] })); // 
    app.use(express.json());
    app.use(cookieParser());


    app.use(express.urlencoded({ extended: true }))
    app.use(passport.initialize())
    jwtPass(passport)
    app.use('/api', router)
    app.get('/page/:id', function(req, res) {
      res.sendFile(__dirname + '/test.html');
    });

    app.listen(PORT, () => {
      console.log(`App listen on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()