import express from 'express';
import {Connection, createConnection} from 'typeorm';


let dbConnection : Connection;
createConnection()
    .then((connection : Connection) => {
      dbConnection = connection;
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
export default (req : express.Request, _res : express.Response, next : express.NextFunction) => {
  req.DbConnection = dbConnection;

  next();
};
