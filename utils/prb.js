const dbtraslado = require('../DB/Final.js')
const db =dbtraslado.DBTRASLADO[3].observaciones.length
const dbcero = dbtraslado.DBTRASLADO[3].observaciones
//console.log(dbtraslado.DBTRASLADO[3]["observaciones"])

  
  for (let j = 0; j < db; j++) {
    const creado = "RR-HH"
    const dni = dbcero[j].documento
    const fecha = dbcero[j].fecha
    const foto_obs = ""
    const local = ""
    const tipo = ""
    const observ = dbcero[j].obs

    const trasladoRowObs = [creado,dni,fecha,foto_obs,local,tipo,observ]
    console.log(trasladoRowObs)
  }
  
// }