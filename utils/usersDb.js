const mysql = require('mysql')

const con = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQLUSS,
  password: process.env.MYSQLPSS,
  database: "ussers"
})



async function consulta(nametable, nombreusuario, dni, legajo) {
  //console.log("usersDb aca",data)

  const sql = `SELECT * FROM ${nametable} WHERE arrobanombre = ? OR dni= ? OR legajo= ?`

  return new Promise((resolve, reject) => {

    con.query(sql, [nombreusuario, dni, legajo], (err, result) => {

      console.log("funcion consulta ", result)

      if (!result[0]) {
        return resolve(false)
      } else {
        return resolve(result)
      }

    })
  })


}


async function consultaUsuario(nameTable, nombreusuario, dni, legajo) {

  const verif = await consulta(nameTable, nombreusuario, dni, legajo);

  console.log("verif", verif)

  if (!verif) {
    return (true)

  } else {
    return (false)
  }
}


const crearUsuario = (nameTable, data) => {
  ////// De manera que puedes insertar varios registros con la misma insert, separando values (xxxx,xxx),(yyyy,yyy),(zzzz,zzz)
  const values = data
  console.log("crearUsuario", values, nameTable)

  const sql = `INSERT INTO ${nameTable} (arrobanombre, pass, creator, role, local,nombcomp,dni,legajo) VALUES ('${values[0]}','${values[1]}', '${values[2]}', '${values[3]}','${values[4]}','${values[5]}','${values[6]}','${values[7]}')`

  return new Promise((resolve, reject) => {

    con.query(sql, async (err, row) => { // https://nicholasmordecai.co.uk/javascript/multiple-inserts-mysql/

      //  console.log(err)

      //console.log("row", row)
      return resolve({
        "mensaje": true,
        "row": row
      });

    })
  })
}


const prb = () => {
  con.getConnection(function (err) {
    if (err) {
      console.error("Error de conexion" + err.stack)
      return
    }
    console.log('Conectado')

  })
}

const consultaLocalNivel = (tabla) => {

  const sql = `SELECT * FROM ${tabla} ;`

  console.log("desde consultaLocalNivel " + tabla)

  return new Promise((resolve, reject) => {

    con.query(sql, (err, result) => {

      if (err) return resolve(console.log(err))

      if (!result[0]) {
        return resolve(false)
      } else {
        return resolve(result)
      }

    })
  })


}

const personalDb = (dniNombre) => {

  const sql = `SELECT * FROM personal WHERE concat(documento,nombre) LIKE "%${dniNombre}%";`



  return new Promise((resolve, reject) => {

    con.query(sql, dniNombre, (err, result) => {

      if (err) return resolve(console.log(err))

      if (!result[0]) {
        return resolve(false)
      } else {
        return resolve(result)
      }

    })
  })


}

const consultaAltaAbm = (data, datainsert) => {
  
  return new Promise((resolve, reject) => {

    const sqlConsulta = `SELECT * FROM ${data} WHERE ${data} LIKE '%${datainsert}%';`

    con.query(sqlConsulta, (err, result) => {

      if (err) return resolve(console.log(err))

      if (!result[0]) {
        return resolve(true)
      } else {
        return resolve(false)
      }

    })
  })


}


const altaAbm = (data, datainsert) => {

  console.log(data, datainsert)

  const sql = `INSERT INTO ${data} (${data}) VALUES (?);`

  return new Promise((resolve, reject) => {

      con.query(sql, datainsert, (err, result) => {

        if (err) return resolve(console.log(err))

        return resolve(true)

      })
    })


}

const abmListados = (lista) => {

  const sql = `SELECT * FROM ${lista} ;`

  return new Promise((resolve, reject) => {
    try 
    {
    con.query(sql, (err, result) => {
      if(err){
        console.log(err)
        return resolve(false)
      } 
      
      if(!result[0]) 
      {
        return resolve(false)
      } else {
      return resolve(result)
      }
    })
      
    
    } catch (err) 
     {
      console.log(error)
     }

  })
}

const abmBorrarItem = (dataId, dataTb, dataValor) => {

  const sql = `DELETE FROM ${dataTb} WHERE ${dataId}=${dataValor} ;`
  console.log(sql)

  return new Promise((resolve, reject) => {

    con.query(sql, (err, result) => {

      if (err) return resolve(console.log(err))

      if (!result[0]) {
        return resolve(true)
      } else {
        return resolve(false)
      }

    })
  })
}


const comentariosDb = (dni)=>{
  const sql = `SELECT * FROM ussers.persobserv WHERE dni='${dni}';`

  return new Promise((resolve, reject) => {
    try 
    {
    con.query(sql, (err, result) => {
      if(err){
        console.log(err)
        return resolve(false)
      } 
      
      if(!result[0]) 
      {
        return resolve(false)
      } else {
      return resolve(result)
      }
    })
      
    
    } catch (err) 
     {
      console.log(error)
     }

  })

}





module.exports = {comentariosDb,consultaUsuario, crearUsuario, prb, consultaLocalNivel, personalDb, altaAbm, abmListados, abmBorrarItem, consultaAltaAbm }
