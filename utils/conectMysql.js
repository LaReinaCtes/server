const mysql = require('mysql')
const dbtraslado = require('../DB/Final.js')

//-----------------------------------
const con = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQLUSS,
  password: process.env.MYSQLPSS,
  database: "ussers"
})
//-----------------------------------
const con2 = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQLUSS,
  password: process.env.MYSQLPSS,
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
      if (row.length === 0) {
        console.log(`desde conectando(conectMysql.js) (Error):`,);
        return resolve({
          "auth": false,
          "mensaje": "Err01"
        })
      };
      //_______
      //====> https://parzibyte.me/blog/2020/08/13/encriptar-contrasenas-node/


      //console.log(`desde conectMysql:(true)`, row[0]);

      return resolve({
        "auth": true,
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

      if (err) return resolve({ "err": err })

      console.log(row)

      if (row.length === 0) {
        console.log(`desde conectMysql:`, row[0]);
        return resolve({
          "auth": false,
        })
      } else {
        return resolve({ "auth": true })
      };


    })
  })
}

const trasladoDB = () => {
  //  INSERT INTO `ussers`.`personal` 
  //  (`idpersonal`, `nombre`, `documento`, `cuil`, `legajo`, `local`, `condicion`, `sector`, `telefono`, `foto_personal`, `direccion`, `estadocivil`, `feachanac`, `nacionalidad`, `email`, `fotosadicionales`, `observaciones`) 
  //  VALUES ('1', 'Rosales Cristian', '26770911', '20267709115', '213', 'ferre', 'planta', 'oficinas', '3794391055', '213', 'Ferre 2034', 'Soltero', '20-09-1978', 'argentino', 'laalemanasrl.panaderia@gmail.com', , );

  //const db=dbtraslado.DBTRASLADO[150].nombre


  const trasladoRowFinal = []

  for (let i = 0; i < dbtraslado.DBTRASLADO.length; i++) {
    const nombreCompleto = dbtraslado.DBTRASLADO[i].apellido.concat(' ', dbtraslado.DBTRASLADO[i].nombre)
    const doc = dbtraslado.DBTRASLADO[i].documento
    const cuil = dbtraslado.DBTRASLADO[i].legajo
    const legajo = dbtraslado.DBTRASLADO[i].legajo
    const local = dbtraslado.DBTRASLADO[i].local
    const condicion = dbtraslado.DBTRASLADO[i].condicion
    const sector = ""
    const telefono = dbtraslado.DBTRASLADO[i].telefono
    const fotoper = dbtraslado.DBTRASLADO[i].foto_personal
    const direccion = ""
    const estadociv = ""
    const fechanac = "2024/01/01"
    const nacionalidad = ""
    const email = ""
    const fotoadic = "{}"
    const obser = "{}"

    const trasladoRow = [nombreCompleto, doc, cuil, legajo, local, condicion, sector, telefono, fotoper,
      direccion, estadociv, fechanac, nacionalidad, email, fotoadic, obser]

    // console.log(trasladoRow)

    const sql3 = `INSERT INTO personal (nombre, documento, cuil, legajo, local, condicion, sector, telefono, foto_personal, direccion, estadocivil, feachanac, nacionalidad, email, fotosadicionales, observaciones)  VALUES (?)`
    con.query(sql3, [trasladoRow], async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

      if (err) {
        console.log(err)
      }
      console.log("echo")

    })
  }

  const db = "hola"
  // console.log(db)
  return db

}
const trasladoDbOserv = () => {
  //  INSERT INTO `ussers`.`personal` 
  //  (`idpersonal`, `nombre`, `documento`, `cuil`, `legajo`, `local`, `condicion`, `sector`, `telefono`, `foto_personal`, `direccion`, `estadocivil`, `feachanac`, `nacionalidad`, `email`, `fotosadicionales`, `observaciones`) 
  //  VALUES ('1', 'Rosales Cristian', '26770911', '20267709115', '213', 'ferre', 'planta', 'oficinas', '3794391055', '213', 'Ferre 2034', 'Soltero', '20-09-1978', 'argentino', 'laalemanasrl.panaderia@gmail.com', , );

  //const db=dbtraslado.DBTRASLADO[150].nombre

  const errores =[]

  for (let i = 0; i < dbtraslado.DBTRASLADO.length; i++) {

    if (dbtraslado.DBTRASLADO[i].observaciones) {
      const dbOserv = dbtraslado.DBTRASLADO[i].observaciones
      
      for (let j = 0; j < dbOserv.length; j++) {
        const creado = "RR-HH"
        const dni = dbtraslado.DBTRASLADO[i].documento < 1000000 || dbtraslado.DBTRASLADO[i].documento ==="" ? dbtraslado.DBTRASLADO[i].id_pers:dbtraslado.DBTRASLADO[i].documento
        const fecha = dbOserv[j].fecha==="0000-00-00" || dbOserv[j].fecha=== '1900-01-00'? "2000-01-01" : dbOserv[j].fecha
        const foto_obs = ""
        const local = ""
        const tipo = ""
        const observ = dbOserv[j].obs

        const trasladoRowObs = [creado, dni, fecha, foto_obs, local, observ, tipo]

        const sql4 = `INSERT INTO persobserv (creado, dni, fecha, foto_obs, local, observ, tipo)  VALUES (?)`
        con.query(sql4, [trasladoRowObs], async (err, row) => {

          if (err) {
            console.log(err)
            errores.push[err]

          }
          
        })
      }
    }
    
    
  console.log(errores)



    // const trasladoRow = [nombreCompleto, doc, cuil, legajo, local, condicion, sector, telefono, fotoper,
    //   direccion, estadociv, fechanac, nacionalidad, email, fotoadic, obser]

    // console.log(trasladoRow)

    // // const sql4 = `INSERT INTO persobserv (credado, dni, fecha, foto_obs, local, observ, tipo)  VALUES (?)`
    // // con.query(sql4, [trasladoRow], async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

    // //   if(err){
    // //     console.log(err)
    // //   }
    // //   

    // // })
    console.log("echo")
  }

  const db = "hola"
  // console.log(db)
  return ({"mensaje":"Realizado"})

}



module.exports = { conectando, altaUser, controlSessiones, trasladoDB, trasladoDbOserv }
