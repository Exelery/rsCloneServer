import mysqlPromise from 'mysql2/promise.js';
import dotenv from 'dotenv'
dotenv.config()

export async function initBd() {
  const dataDb = await mysqlPromise.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
  });
  try {
    const connectResult = await dataDb.connect()
    // console.log(connectResult)
    console.log(`Connected to database as id ${dataDb.threadId}`);
  } catch (err) {
    console.error(`Error connecting to database: ${err.stack}`);
  }


  const createTable = `CREATE TABLE IF NOT EXISTS ${process.env.TABLEUSERDATANAME} (
    id VARCHAR(255) PRIMARY KEY,
    path VARCHAR(255) NOT NULL UNIQUE,
    data VARCHAR(max) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`

  const result = await dataDb.query(createTable);
  // console.log(result)
  console.log(`Table ${process.env.TABLEUSERDATANAME} created`);

  return dataDb
}
