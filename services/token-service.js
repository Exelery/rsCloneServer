import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import TokenDB from '../databases/tokenDb.js'
config()

export default class TokenService {
  constructor() {
    this.initDatase()
  }

  initDatase = async () => {
    const tokenBd = new TokenDB()
    if (!this.bd) {
      this.bd = await tokenBd.initBd()
    }
  }

  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, { expiresIn: '30m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: '30d' })
    return {
      accessToken, refreshToken
    }
  }

  saveToken = async (userId, refreshToken) => {
    try {
      await this.initDatase()
      const sql = `INSERT INTO ${process.env.TABLETOKENNAME} (id, token)
    VALUES (${userId}, '${refreshToken}')
    ON DUPLICATE KEY UPDATE
    token = '${refreshToken}';`
      const answer = await this.bd.query(sql)
    } catch (err) {
      console.log(err)
      //
    }
  }
  
  removeToken = async (refreshToken) => {
    try {
      const sql = `DELETE FROM ${process.env.TABLETOKENNAME}
      WHERE token = '${refreshToken}';`
      const answer = await this.bd.query(sql)
      return answer
      // console.log('token', answer)
    } catch (err) {
      console.log(err)
    }
  }
  
  findToken = async (refreshToken) => {
    try {
      const sql = `SELECT id, token FROM ${process.env.TABLETOKENNAME}
      WHERE token = '${refreshToken}';`
      const [rows, fields] = await this.bd.query(sql)
      if (typeof rows !== 'undefined' && rows.length > 0) {
        return rows[0]
      }
      // console.log('token', answer)
    } catch (err) {
      console.log(err)
    }
  }
  
  validateAccessToken = async (token) =>{
    try {
      const data = jwt.verify(token, process.env.JWT_ACCESS)
      return data
    } catch(err) {
      return null
    }
  }
  
  validateRefreshToken = async (token) =>{
    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH)
      return data
    } catch(err) {
      return null
    }
  }
}
