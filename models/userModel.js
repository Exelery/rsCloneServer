import dotenv from 'dotenv'
dotenv.config()

export default class UserModel {

  constructor(connection) {
    this.bd = connection
  }

  async createUser(name, email, password) {
    const sql = `INSERT INTO ${process.env.TABLENAME}(name, email, password, activationLink) VALUES("${name}", "${email}", "${passwordHash}", "${activationLink}")`;
    const answer = await this.bd.query(sql)
    return answer[0].insertId
  }

  async getUserByEmail(email) {
    const sqlCheck = `SELECT id, name, email, isActivated FROM ${process.env.TABLENAME} WHERE email = "${email}"`;
    const answer = await this.bd.query(sqlCheck)
    return answer[0][0]
  }



}