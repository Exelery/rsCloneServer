import dotenv from 'dotenv'
import { initBd } from '../databases/dataDb.js'
import { response } from '../response.js'
import { readFile, writeFile } from 'fs/promises';
dotenv.config()

export default class DataController {
  bd;
  addUserData = async (req, res) => {
    try {
      const { id, data } = req.body
      console.log(id, data)
      if (!this.bd) {
        this.bd = await initBd()
      }
      const sql = `INSERT INTO ${process.env.TABLEUSERDATANAME} (id, path, data)
      VALUES (${id}, 'some path', '${data}')
      ON DUPLICATE KEY UPDATE path = 'some path', data = '${data}'`
      // const sql = `INSERT INTO ${process.env.TABLEUSERDATANAME}(userId, path, data) VALUES('2', 'url2', 'html')`
      const result = await this.bd.query(sql)
      response(200, 'data has changed', res)
      console.log(result)
    } catch (err) {
      response(400, err, res)
    }

  }

  getUserData = async (req, res) => {
    try {
      const { id } = req.body
      console.log(id)
      if (!this.bd) {
        this.bd = await initBd()
      }
      const sql = `SELECT path, data FROM ${process.env.TABLEUSERDATANAME} WHERE id = ${id}`
      const result = await this.bd.query(sql)
      response(200, result[0], res)
      console.log(result)
    } catch (err) {
      response(400, err, res)
    }

  }
}