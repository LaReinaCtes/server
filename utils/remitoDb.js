const mysql = require('mysql')

const con = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQLUSS,
  password:process.env.MYSQLPSS,
  database: "fabdep"
})

const cargaRemitos = (nameTable, data) => {
  ////// De manera que puedes insertar varios registros con la misma insert, separando values (xxxx,xxx),(yyyy,yyy),(zzzz,zzz)

  const values = data

  const sql = `INSERT INTO ${nameTable}(fecha,local,cantidad,producto,id_remitos,idadb,remobs) 
  VALUES ?`


  //INSERT INTO `remitonum`(`id`, `fecha`, `idremgen`, `observ`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]')


  return new Promise((resolve, reject) => {

    con.query(sql, [values], async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

      // console.log("row", row)
      return resolve({
        "mensaje": "Remito Guardado"
      });

    })
  })

}

const cargaRemitos2 = (nameTable2, data2) => {
  ////// De manera que puedes insertar varios registros con la misma insert, separando values (xxxx,xxx),(yyyy,yyy),(zzzz,zzz)

  const valuesNumRem = data2
  //const values = ['', 'local 1', 10, 'producto 1', 'jkldfjfdsfioewr4343']


  const sql2 = `INSERT INTO ${nameTable2}(fecha,idremgen,observ) 
  VALUES ?`

  return new Promise((resolve, reject) => {

    con.query(sql2, [valuesNumRem], async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

      return resolve({
        "mensaje": row.insertId || "Remito Guardado"
      });

    })
  })

}

const consultaCuit = (nameTable, data) => {

  const sql = `SELECT * FROM ${nameTable} WHERE cuit = ?`

  return new Promise((resolve, reject) => {
    con.query(sql, [data], (err, result) => {

      // (result[0].id)

      if (!result[0].id === undefined) {
        // console.log("verdadero")
        return resolve(true)

      } else {
        // console.log("falso")
        return resolve(false)

      }
    })

  })
}


const proveedorADb = (nameTable, data) => {
  ////// De manera que puedes insertar varios registros con la misma insert, separando values (xxxx,xxx),(yyyy,yyy),(zzzz,zzz)
  const values = data
  // console.log(values)

  const sql = `INSERT INTO ${nameTable} (proveedor, cuit, mail, idprov, telefono, observaciones) VALUES ('${values[0]}','${values[1]}','${values[2]}','${values[3]}','${values[4]}','${values[5]}')`

  return new Promise((resolve, reject) => {

    con.query(sql, async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

      // console.log("row", row)
      return resolve({
        "mensaje": true,
        "row": row
      });

    })
  })
}


module.exports = { cargaRemitos, cargaRemitos2, proveedorADb, consultaCuit }