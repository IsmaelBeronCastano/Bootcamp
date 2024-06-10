import {createPool} from 'mysql2/promise'
import dotenv from 'dotenv'



export default createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "kodotiwallet",
    decimalNumbers: true
})