import { ConnectionPool } from 'mssql' ;

let config = {
    server: process.env.deb_mssql_server as string, //casteo a string para que no me de error en la ConnectionPool
    user: process.env.deb_mssql_user as string,
    password: process.env.deb_mssql_password as string,
    database: process.env.deb_mssql_database as string,
    options:{
        enableArithAbort: true
    }
}

export default new ConnectionPool(config).connect()