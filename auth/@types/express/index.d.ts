/* eslint-disable no-unused-vars */
import {Connection} from 'typeorm';

declare global{
    namespace Express {
        interface Request {
            DbConnection: Connection;
        }
    }
}
