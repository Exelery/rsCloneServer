import express from 'express';
import { config } from 'dotenv';
import passport from 'passport';
import { router } from './router/routes.js'
import { jwtPass } from './middleware/passport.js'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import Connection from './databases/createConnection.js';
config()




const start = async () => {
  try {

    const PORT = process.env.PORT
    const app = express()
    // await Connection.getInstance()

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors()); // {credentials: true,origin: process.env.CLIENT_URL}
    app.use(express.urlencoded({ extended: true }))
    app.use(passport.initialize())
    jwtPass(passport)
    app.use('/api', router)

    app.listen(PORT, () => {
      console.log(`App listen on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()