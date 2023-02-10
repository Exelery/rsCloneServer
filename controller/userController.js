import { response } from '../response.js'
import { authDb } from '../databases/authDb.js'
import UserService from '../services/userService.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config()

const userService = new UserService();
export default class UserController {

  async getAllUsers(req, res) {
    authDb.query(`SELECT id, email password FROM ${process.env.TABLENAME}`, (error, rows, fields) => {
      if (error) {
        response(500, error, res);
      } else {
        response(200, rows, res)
      }
    })

  }

  async signup(req, res) {
      const { email, password } = req.body
      await userService.registration(email, password, res)
  }
  
  async signin(req, res) {
    const { email, password } = req.body
    await userService.singin(email, password, res)
  }
}