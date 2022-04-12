const Pool = require('pg').Pool;

const pool = new Pool({
   user: "",
   password: "",
   host: "",
   port: 5432,
   database: "",
   // ssl: {
   //    rejectUnauthorized: false,
   // }
})

module.exports = pool; 