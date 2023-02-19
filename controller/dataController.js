import dotenv from 'dotenv'
import DataDB from '../databases/dataDb.js'
import { response } from '../response.js'
import DataModel from '../models/dataModel.js';
import TokenService from '../services/token-service.js';
dotenv.config()

export default class DataController {
  bd;
  dataModel
  constructor() {
    this.initDatase()
  }

  initDatase = async () => {
    const dataBd = new DataDB()
    if (!this.bd) {
      this.bd = await dataBd.initBd()
      this.dataModel = new DataModel()
    }

  }

  getUserProjects = async (req, res) => {
    try {
      const userId = await TokenService.getUserIdFromHeader(req)
      // const { userId } = req.body
      // console.log('getprojets', temp.id)
      const answer = await this.dataModel.getUserData(userId)
      console.log(answer)
      if (!answer) {
        return response(400, "User doesn't exist", res)

      }

      response(200, answer, res)
    } catch (err) {
      console.log(err)
      response(500, err, res)
    }
  }


  addProject = async (req, res) => {
    try {
      const { projectName, data } = req.body
      const userId = await TokenService.getUserIdFromHeader(req)

      const answer = await this.dataModel.addNewProjects(userId, projectName, data)
      response(200, { projectId: answer.projectId }, res)
    } catch (err) {
      console.log(err)
      response(500, err, res)
    }
  }

  updateProject = async (req, res) => {
    try {
      const { projectId, projectName, data } = req.body
      const userId = await TokenService.getUserIdFromHeader(req)
      const answer = await this.dataModel.updateProject(userId, projectId, projectName, data)
      console.log(answer[0].insertId)
      if (answer[0].affectedRows) {
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
      const { projectId } = req.body
      console.log(req.data)
      const userId = await TokenService.getUserIdFromHeader(req)

      const answer = await this.dataModel.deleteProject(userId, projectId)
      console.log(answer[0])
      if (answer) {
        response(200, `Project ${projectId} deleted`, res)
      } else {
        response(302, `Project ${projectId} doesn't exist`, res)
      }
    } catch (err) {
      console.log(err)
      response(500, err, res)
    }
  }

}