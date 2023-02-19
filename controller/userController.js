import { response } from '../response.js'
import UsersDB from '../databases/authDb.js'
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import MailService from '../services/mailServer.js'
import { config } from 'dotenv';
import TokenService from '../services/token-service.js'
import { validationResult } from 'express-validator';
import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
config()

const tokenService = new TokenService()
export default class UserController {
  bd;
  userModel;
  
  constructor() {
    this.initDatase()
  }

  initDatase = async () => {
    const userBd = new UsersDB()
    if (!this.bd) {
      this.bd = await userBd.initBd()
      this.userModel = new UserModel(this.bd)
    }
  }

  getAllUsers = async (req, res) => {
    try {
      const [rows, columns] = await this.bd.query(`SELECT id, email password FROM ${process.env.TABLENAME}`)
      response(200, rows, res)
    } catch (err) {
      console.log(err)
      response(500, err, res);
    }
  }
  
  getUser = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const temp = TokenService.validateAccessToken(token)
      const answer = await this.userModel.getUserByEmail(temp.email)
      console.log(answer)
      // const [rows, columns] = await this.bd.query(`SELECT id, email password FROM ${process.env.TABLENAME}`)
      response(200, answer, res)
    } catch (err) {
      console.log(err)
      response(500, err, res);
    }
  }
  
  registration = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(400, { error: "Baq request", errors: errors }, res);
      }
      const { name, email, password } = req.body
      const sqlCheck = `SELECT id, email, password FROM ${process.env.TABLENAME} WHERE email = "${email}"`;
      const [rows, fields] = await this.bd.query(sqlCheck)
      console.log(rows)
      if (typeof rows !== 'undefined' && rows.length > 0) {
        rows.map(rw => {
          response(302, `User with name - ${rw.email} already exist`, res)
          return true
        })
      } else {
        const salt = bcrypt.genSaltSync(15)
        const passwordHash = await bcrypt.hash(password, salt)
        const activationLink = this.sendActivationMail(email)
        const sql = `INSERT INTO ${process.env.TABLENAME}(name, email, password, activationLink) VALUES("${name}", "${email}", "${passwordHash}", "${activationLink}")`;
        const answer = await this.bd.query(sql)
        const tokens = await tokenService.generateTokens({ email: email, id: answer.insertId })
        console.log('tokens', tokens)
        await tokenService.saveToken(answer[0].insertId, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        response(200, `Registration is successful`, res)
      }
    } catch (err) {
      console.log(err)
      response(500, err, res);
    }

  }

  sendActivationMail(email) {
    const activationLink = uuidv4()
    const mailService = new MailService()
    mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)
    return activationLink
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body
      // await userService.singin(email, password, res)
      const [rows, fields] = await this.bd.query(`SELECT id, email, password FROM ${process.env.TABLENAME} WHERE email = "${email}"`)
      if (rows.length <= 0) {
        response(401, { message: `Пользователь с email - ${email} не найден. Пройдите регистрацию.` }, res)
      } else {
        rows.map(async rw => {
          console.log(rw)
          const passwordEqual = bcrypt.compareSync(password, rw.password)
          if (passwordEqual) {
            const tokens = await tokenService.generateTokens({
              userId: rw.id,
              email: rw.email
            })
            await tokenService.saveToken(rw.id, tokens.refreshToken)
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            // res.set('Access-Control-Allow-Origin', process.env.SITE_URL)
            // res.set('Access-Control-Allow-Credentials', 'true')
            response(200, { id: rw.id, ...tokens }, res)

          } else {
            response(401, { message: `Пароль не верный.` }, res)

          }
        })
      }
    } catch (err) {
      console.log(err)
      response(400, err, res)
    }

  }

  logout = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      console.log(refreshToken)
      const token = await tokenService.removeToken(refreshToken);
      res.clearCookie('refreshToken');
      return response(200, token, res);
    } catch (err) {
      console.log(err);
    }
  }

  activate = async (req, res, next) => {
    try {
      const activationLink = req.params.link;
      console.log(activationLink)
      const sqlCheck = `SELECT id FROM ${process.env.TABLENAME} WHERE activationLink = "${activationLink}"`;
      const [rows, fields] = await this.bd.query(sqlCheck)
      console.log(rows)
      if (typeof rows !== 'undefined' && rows.length > 0) {
        rows.map(async rw => {
          const sql = `UPDATE ${process.env.TABLENAME}
          SET isActivated = true
          WHERE id = ${rw.id}`
          await this.bd.query(sql)

          return true
        })
      }
      response(200, rows, res)
      // await userService.activate(activationLink);
      // return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      console.log(err)
      response(500, err, res);
    }
  }

  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.cookies;
      console.log(refreshToken)
      if (!refreshToken) {
        return response(400, "No refresh Token", res);
      }
      const userData = TokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken)
      console.log('userData', userData)
      console.log('tokenFromDb', tokenFromDb)
      if (!userData || !tokenFromDb) {
        return response(400, "Unauthorisation Error", res);
      }

      const [rows, fields] = await this.bd.query(`SELECT id, email, password FROM ${process.env.TABLENAME} WHERE id = ${userData.userId}`)
      if (rows.length <= 0) {
        return response(401, { message: `Пользователь с id - ${userData.id} не найден. Пройдите регистрацию.` }, res)
      } else {
        rows.map(async rw => {
          console.log(rw)

          const tokens = await tokenService.generateTokens({
            userId: rw.id,
            email: rw.email
          })
          response(200, tokens.accessToken, res)


        })
      }
    } catch (err) {
      console.log(err);
      response(500, err, res);
    }
  }

}