const express = require("express");
require("dotenv").config();

const authRouther = require("./route-auth/auth-path.js");
const {dcryptUserPass} = require("./utils/crypUncryt.js");


const cookieParser = require("cookie-parser");

const { conectando } = require("./utils/conectMysql.js");
const { cargaRemitos, cargaRemitos2, proveedorADb, consultaCuit} = require("./utils/remitoDb.js");
const { consultaUsuario, crearUsuario } = require("./utils/usersDb.js");

const cors = require("cors");
const app = express();

app.use(cors());


// ///:::::::::::::::::::::::::::::::::::::::::::::::
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//   next()
  
//   app.options('*', (res, req) => {
//    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS')
//   })
//   })
// //// ···············································
// //app.use(cors({ origin: 'http://localhost:3000', credentials: true }));



//{ origin: 'http://192.168.0.18:3000', credentials: true })

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
//app.use("/auth", authRouther);

// Allow cors middleware
  

//app.options( '*',cors())

// app.get("/", (req, res) => {
//   console.log(req)
//   return res.send("<h1>Sitio Landing</h1>");
// });

// app.get("/registro", (req, res) => {
//   return res.send("<h1>Sitio Registro</h1>");
// });


const puerto = process.env.PORT;
app.listen(puerto, (req, res) => {
  console.log(`Servidor en puerto ${puerto}`);
});

//------------------------login---------------------------------------------

app.post("/login", async (req, res) => {
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");

  const { name, psswd } = req.body;

  if (name === undefined && psswd === undefined) return ({ "mensaje": "Faltan Datos", "auth": false });


  const dbnamecontr = await conectando("tablaprb", name, psswd)

  if (dbnamecontr.mensaje === "Err01") return res.json({ auth: false });

  if (!dbnamecontr.nombre === name) return res.json({ mensaje: "Sin usuarios con ese dato" });

  console.log("1")
  //________________________________
  const controlPass= await dcryptUserPass(psswd,dbnamecontr.pass)
        
    console.log("3")

    if(!controlPass) {
      return res.json({auth:"false0"})
    }else{
      return res.json({
        auth: true,
        nombre: dbnamecontr.nombcomp,
        legajo: dbnamecontr.legajo,
        mensaje: "Bienvenido"
      });
    }
  
  
  
  controlPass(psswd, dbnamecontr.pass);

  //________________________________

});


app.post("/cargadb", async (req, res) => {
  const { data } = req.body


  const dataFecha = data.map(datas => datas.fecha)
  const dataLocal = data.map(datas => datas.local)
  const dataCantidad = data.map(datas => datas.cantidad)
  const dataProducto = data.map(datas => datas.producto)
  const dataId = data.map(datas => datas.id)
  const dataidadb = data.map(datas => datas.idADb)
  const dataObs = data.map(datas => datas.observaciones)

  console.log(dataObs)


  let dataADb = []
  let dataADb2 = []

  let contador = dataFecha.length

  for (contador; contador > 0; contador--) {
    const tempadb = [dataFecha[contador - 1], dataLocal[contador - 1], parseInt(dataCantidad[contador - 1]), dataProducto[contador - 1], dataId[contador - 1], dataidadb[contador - 1]]
    dataADb = [...dataADb, tempadb]
  }

  //let contador2 = dataFecha.length
  //for (contador2; contador2 > 0; contador2--) {
  const tempadb2 = [dataFecha[0], dataidadb[0], dataObs[0]]
  dataADb2 = [tempadb2]
  //}



  const result = await cargaRemitos("cargaremito", dataADb)

  const result2 = await cargaRemitos2("remitonum", dataADb2)

  return res.send(result2)

})

app.post("/cargaproveed", async (req, res) => {
  const { data } = req.body

  const cuit = data.cuit
  const idprov = data.id
  const mail = data.mail
  const observaciones = data.observaciones
  const proveedor = data.proveedor
  const telefono = data.telefono

  // ############################

  const proveed = [proveedor, cuit, mail, idprov, telefono, observaciones]

  // ############################

  const cuitExist = await consultaCuit("proveedor", cuit)
  
  if (cuitExist) {
    console.log("DESDE index.js (true)", cuitExist)
    return res.send({
      "mensaje": false
    })
  }else{
    console.log("DESDE index.js (false)",cuitExist)
    const result = await proveedorADb("proveedor", proveed)
    // console.log(result)
    return res.send(result)
  }


})

app.post("/altauser", async (req, res) => {

  console.log(req.body)
  console.log(req.body.data.user)

  const nombreusuario = req.body.data.user
  const userpass = req.body.data.pass

  // ############################
  // console.log(req.body.user)
  // console.log(req.body.pass)

  const usuarioData = [nombreusuario, userpass]

  // ############################

  const userExist = await consultaUsuario("tablaprb", nombreusuario)
  
  if (!userExist) {
    //console.log(userExist)
    return res.send({
      "mensaje": "Cliente existente, cambie nombre de Usuario"
    })

  }else{

    await crearUsuario("tablaprb",usuarioData)
    
    console.log("Alta de usuario")
    return res.send({
      "mensaje": "Usuario dado de ALTA"
    })
  }

})
