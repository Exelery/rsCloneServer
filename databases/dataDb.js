import dotenv from 'dotenv'
import Connection from './createConnection.js';
dotenv.config()

export default class DataDB {
  async initBd() {
    const dataDb = await Connection.getInstance()
    const createTable = `CREATE TABLE IF NOT EXISTS ${process.env.TABLEUSERDATANAME} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hash VARCHAR(255) PRIMARY KEY,
      files JSON
    );`

    const result = await dataDb.query(createTable);
    // console.log(result)
    console.log(`Table ${process.env.TABLEUSERDATANAME} created`);
    this.db = dataDb
    return dataDb
  }
  
}