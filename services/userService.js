import { authDb } from "../databases/authDb.js";
import { response } from '../response.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import MailService from './mailServer.js'



export default class UserService {
  async registration(email, password, res) {

    const sqlCheck = `SELECT id, email, password FROM ${process.env.TABLENAME} WHERE email = "${email}"`;
    authDb.query(sqlCheck, async (error, rows, fields,) => {
      if (error) {
        response(400, error, res);
      } else if (typeof rows !== 'undefined' && rows.length > 0) {
        const row = JSON.parse(JSON.stringify(rows))
        row.map(rw => {
          response(302, { message: `User with name - ${rw.email} already exist` }, res)
          return true
        })
      } else {
        const activationLink = uuidv4()
        const mailService = new MailService()
        // await mailService.sendActivationMail{mail, }
        const salt = bcrypt.genSaltSync(15)
        const passwordHash = bcrypt.hashSync(password, salt)
        const sql = `INSERT INTO ${process.env.TABLENAME}(email, password) VALUES("${email}", "${passwordHash}")`;
        authDb.query(sql, (error, results) => {
          if (error) {
            response(400, error, res)
          } else {
            response(200, { message: `Registration is successful`, results }, res)
          }
        })

      }
    })
  }

  singin(email, password, res) {
    authDb.query(`SELECT id, email, password FROM ${process.env.TABLENAME} WHERE email = "${email}"`, (error, rows, fields) => {
      if (error) {
        response(400, error, res)
      } else if (rows.length <= 0) {
        response(401, { message: `Пользователь с email - ${email} не найден. Пройдите регистрацию.` }, res)
      } else {
        const row = JSON.parse(JSON.stringify(rows))
        row.map(rw => {
          const password = bcrypt.compareSync(password, rw.password)
          if (password) {
            const token = jwt.sign({
              userId: rw.id,
              email: rw.email
            }, process.env.JWT, { expiresIn: 120 * 120 })

            response(200, { token: `Bearer ${token}` }, res)

          } else {
            response(401, { message: `Пароль не верный.` }, res)

          }
          return true
        })
      }
    })
  }
}