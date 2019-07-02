import { ConnectionOptions } from 'typeorm';
import path from 'path';

export let dbConfig : ConnectionOptions = {
   type: 'mysql',
   host: 'localhost',
   port: 3306,
   username: 'root',
   password: 'root',
   database: 'quotes',
   entities: [
        path.join(__dirname, './../entities/*.js')
   ] 
}