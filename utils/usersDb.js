const mysql = require('mysql')

const con = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQLUSS,
  password:process.env.MYSQLPSS,
  database: "ussers"
})



async function consulta(nametable,nombreusuario, dni, legajo) {
    //console.log("usersDb aca",data)

    const sql = `SELECT * FROM ${nametable} WHERE arrobanombre = ? OR dni= ? OR legajo= ?`
    
    return new Promise((resolve, reject) => {

    con.query(sql, [nombreusuario, dni, legajo], (err, result) => {
            
        console.log("funcion consulta ",result)
        
        if(!result[0]){
            return resolve (false)
        }else{
            return resolve (result)
        }

        })
    })
    
    
}


async function consultaUsuario (nameTable, nombreusuario, dni, legajo){
    
    const verif = await consulta(nameTable,nombreusuario, dni, legajo);

    console.log("verif",verif)

    if (!verif) {
        return (true)
        
        } else {
        return (false)
        }
}


const crearUsuario = (nameTable, data) => {
  ////// De manera que puedes insertar varios registros con la misma insert, separando values (xxxx,xxx),(yyyy,yyy),(zzzz,zzz)
  const values = data
  console.log("crearUsuario",values, nameTable)

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
  con.getConnection(function(err) {
    if(err){
      console.error("Error de conexion" + err.stack)
      return
    }
    console.log('Conectado')
  
})
}

const consultaLocalNivel = (tabla)=>{
  
  const sql = `SELECT * FROM ${tabla} ;`

  console.log("desde consultaLocalNivel "+tabla )
    
  return new Promise((resolve, reject) => {

  con.query(sql, (err, result) => {
      
      if(err) return resolve(console.log(err))
        
      if(!result[0]){
          return resolve (false)
      }else{
          return resolve (result)
      }

      })
  })


}

module.exports = { consultaUsuario,crearUsuario, prb, consultaLocalNivel }
