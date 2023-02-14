import dotenv from 'dotenv'
import DataDB from '../databases/dataDb.js'
import { response } from '../response.js'
import { readFile, writeFile, unlink, mkdir } from 'fs/promises';
import initProjectsBd from '../databases/projectsDb.js';
dotenv.config()

export default class DataController {
  bd;
  constructor() {
    this.dataPath = process.cwd() + '/data'
    mkdir(`${this.dataPath}`, { recursive: true })
    this.initDatase()
  }

  initDatase = async () => {
    const dataBd = new DataDB()
    if (!this.bd) {
      this.bd = await dataBd.initBd()
    }

  }

  getUserData = async (req, res) => {
    try {
      const { userId } = req.body
      const sql = `SELECT * FROM table_${userId}`
      const result = await this.bd.query(sql)
      console.log(result[0])
      if (!result[0]) {
        response(400, "User doesn't exist", res)
        return
      }

      const answer = await Promise.all(result[0].map(async (el) => {
        return {
          projectId: el.id,
          projectName: el.value,
          data: await readFile(`${this.dataPath}/${userId}/${el.id}`, 'utf8')
        }
      }))
      response(200, answer, res)
    } catch (err) {
      console.log(err)
      response(500, err, res)
    }
  }

  writeProjectFile = async (id, name, data) => {
    await mkdir(`${this.dataPath}/${id}`, { recursive: true })
    await writeFile(`${this.dataPath}/${id}/${name}`, data)
  }

  addProject = async (req, res) => {
    try {
      const { userId, projectName, data } = req.body
      await initProjectsBd(this.bd, userId)
      const sql = `INSERT INTO table_${userId} (id, value)
      VALUES (id, '${projectName}')
      ON DUPLICATE KEY UPDATE id = id, value = '${projectName}';`
      const answer = await this.bd.query(sql)
      this.writeProjectFile(userId, answer[0].insertId, data)
      console.log(answer[0].insertId)
      response(200, { projectID: answer[0].insertId }, res)
    } catch (err) {
      console.log(err)
      response(500, err, res)
    }
  }

  updateProject = async (req, res) => {
    try {
      const { userId, projectId, projectName, data } = req.body
      const sql = `UPDATE table_${userId}
      SET value = '${projectName}'
      WHERE id = ${projectId}`
      const answer = await this.bd.query(sql)
      this.writeProjectFile(userId, projectId, data)
      console.log(answer[0].insertId)
      if(answer[0].affectedRows) {
        response(200, `Project ${projectId} updated`, res)
      } else {
        response(400, `Project ${projectId} doesn't exist`, res)
      }
    } catch (err) {
      console.log(err)
      response(500, err, res)
    }
  }

  deleteProject = async (req, res) => {
    try {
      const { userId, projectId } = req.body
      const sql = `DELETE FROM table_${userId}
      WHERE id = ?;`
      const answer = await this.bd.query(sql, projectId)
      unlink((`${this.dataPath}/${userId}/${projectId}`))
      console.log(answer[0])
      if(answer[0].affectedRows) {
        response(200, `Project ${projectId} deleted`, res)
      } else {
        response(400, `Project ${projectId} doesn't exist`, res)
      }
    } catch (err) {
      console.log(err)
      response(500, err, res)
    }
  }

}