const mysql = require('mysql')

//-----------------------------------
const con = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQLUSS,
  password:process.env.MYSQLPSS,
  database: "ussers"
})
//-----------------------------------
const con2 = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQLUSS,
  password:process.env.MYSQLPSS,
  database: "datasessions"
})
//-----------------------------------



const conectando = async (nameTable, user) => {

  ///_______________________________________________________________________
  return new Promise((resolve, reject) => {
    
    //SELECT * FROM tablaprb WHERE arrobanombre = '@rosalescristian' AND pass='r027F';
      
    //original ::::::: con.query(`SELECT * FROM ${nameTable} WHERE arrobanombre = '${user}'`, (err, row) => {
        //console.log(err, row)
//__________________
         con.query(`SELECT * FROM ${nameTable} WHERE arrobanombre = '${user}'`, (err, row) => {
        if (row.length === 0){
          console.log(`desde conectando(conectMysql.js) (Error):`, );
          return resolve({
            "auth": false,
            "mensaje": "Err01"
          })
        };
//_______
        //====> https://parzibyte.me/blog/2020/08/13/encriptar-contrasenas-node/
          
          
      //console.log(`desde conectMysql:(true)`, row[0]);
      
        return resolve({
          "auth":true,
          "role": row[0].role,
          "nombcomp": row[0].nombcomp,
          "legajo": row[0].legajo,
          "pass": row[0].pass,
          "usser": row[0].arrobanombre
        });

      

    })
  })


 }


const altaUser = (nameTable, user) => {
  
  const valuesNumRem = user
  
  const sql2 = `INSERT INTO ${nameTable2}(fecha,idremgen,observ) VALUES ?`

  return new Promise((resolve, reject) => {

    con.query(sql2, [valuesNumRem], async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

      return resolve({
        "mensaje": row.insertId || "Usuario dado de ALTA"
      });

    })
  })
}

const controlSessiones = (nameTable, cookieId) => {
  
  const ckie = cookieId
  
  const sql = `SELECT data FROM sessions WHERE session_id='${ckie}';`

  return new Promise((resolve, reject) => {

    con2.query(sql, async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

      if(err) return resolve({"err":err})
      
      console.log(row)

      if (row.length === 0){
        console.log(`desde conectMysql:`, row[0]);
        return resolve({
          "auth": false,
        })
      }else{
        return resolve({"auth":true})
      };


    })
  })
}



module.exports = { conectando,altaUser,controlSessiones }
