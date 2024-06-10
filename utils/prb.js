const mysql = require('mysql')

const con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ussers"
})

const conectando = () => {


  con.query("SELECT * FROM tablaprb WHERE nombre = 'Rsales'", (err, row) => {
    try {
      if(row.length===0) return console.log("mala cosa")
  
      return console.log("row", row[0].nombre)
  
    } catch (err) {
     
      return console.log(
        "err",        
      )
      
    }
})
}

conectando()
