import mysqlPromise from 'mysql2/promise.js';
import dotenv from 'dotenv'
dotenv.config()


export default class Connection {
  static connection = null;

  static async getInstance() {
    if (!Connection.connection) {
      Connection.connection = await mysqlPromise.createConnection({
        host: process.env.HOST,
        port: process.env.DBPORT,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME
      });
      
      try {
        await Connection.connection.connect()
        console.log(`Connected to database as id ${Connection.connection.threadId}`);
      } catch (err) {
        console.error(`Error connecting to database: ${err.stack}`);
      }
    }

    return Connection.connection;
  }

  static query(sql, values) {
    return Connection.connection.query(sql, values);
  }
}


// const connection = Connection.getInstance()
// console.log(connection)