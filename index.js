const express = require("express");

const jwt = require("jsonwebtoken");

const fs = require('fs')

const path = require('path')

const cookieParser = require("cookie-parser");
// para cargar archivos
const fileUpload = require("express-fileupload")
const morgan = require("morgan")


require("dotenv").config();


//----------------------------------------------------------
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
//----------------------------------------------------------

const {dcryptUserPass, crypUserPass} = require("./utils/crypUncryt.js");


const { conectando,trasladoDB, trasladoDbOserv } = require("./utils/conectMysql.js");
const { cargaRemitos, cargaRemitos2, proveedorADb, consultaCuit} = require("./utils/remitoDb.js");
const { consultaUsuario, crearUsuario , prb, consultaLocalNivel,
  personalDb,altaAbm,abmListados,abmBorrarItem,
  consultaAltaAbm,comentariosDb} = require("./utils/usersDb.js");
const {tokenCreate, tokenData} = require ("./utils/tokenAccess.js")


const cors = require("cors");
const { stringify } = require("uuid");



const app = express();

app.use(cors(
  {
    credentials:true,
    origin:true
  }
)); //Funciona mientras este bien direccionado con este dominio(Axios => 192.168...)

// MIDDLEWARE --------------------------------------------


app.use(cookieParser());
app.use(express.json());
app.use(express.text());

app.use(fileUpload({
  createParentPath: true
}))
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"))

//--------------------- Sesiones -------------------------
const options = {
  host: "localhost",
  port: 3306,
  user: process.env.MYSQLUSS,
  password:process.env.MYSQLPSS,
  createDatabaseTable: true,
  database: "datasessions",
  clearExpired: true,
  checkExpirationInterval:1000,
  expiration: 36000000
};

const sessionStore = new MySQLStore(options);

app.use(session({
	key: 'lrn-cookie',
	secret: process.env.SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

//---------------------------------------------------------

const tokenVal =  async (req,res,next)=>{

  const dataVerif=(dataToken)=>{
  
    if(dataToken===undefined) return res.json({"tokenError":true})
    
  //  console.log("Cookie token --> "+Object.keys(dataToken))
  //console.log("Cookie token --> "+dataToken)
  
    
    if(!dataToken) next(new Error("Sin Token Cris"))
    
    try {
      const verTok = jwt.verify(dataToken,process.env.SECRET)
  
        if(verTok.exp < Date.now()) console.log("ya paso")
        
        //console.log(verTok.exp)
        //console.log(Date.now())
        
        if(!verTok){
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.send('<a href="http://192.168.0.16:3000"> Consulte con el Administrador (Err-1005)</a>')
        }else{
            if(verTok.exp < Date.now()){
                res.setHeader('Access-Control-Allow-Origin', '*');
                //res.redirect('http://192.168.0.16')
        res.send('<a href="http://192.168.0.16:3000"> Consulte con el Administrador (Err-1005)</a>')
  
            } 
        }
  
        req.creator = verTok.legajo
        console.log(req.creator)
        
    } catch (error) {
        console.log(error)
  
  
        res.json({"tokenError":true})
  
    }
    
    next()
  }

 //···········································
  cookieParser(req,res,next)
  console.log(req.body.token)


  if(req.query.token){
    const dataToken =req.query.token
    console.log("query")
    dataVerif(dataToken)

 
  }else if(req.body.token){
    const dataToken =req.body.token
    console.log("body")
    dataVerif(dataToken)

  }else{
    return res.send({"mesagge":"Sin token"})
  }
 //···········································

    
}

const prbSite = (req,res,next)=>{
  return res.send(`<a href='${process.env.SITIOFRONT}'>Error al cargar, vuelva al login.</a>`)
  next()
}


//_____________________________________________________________________________

const puerto = process.env.PORT;


app.listen(puerto, (req, res) => {
  console.log(`Servidor en puerto ${puerto}`);
});

//------------------------login---------------------------------------------

app.post("/login", async (req, res) => {
  
  const { name, psswd } = req.body;



  if (name === undefined && psswd === undefined) return ({ "mensaje": "Faltan Datos" , "auth": false });

  const dbnamecontr = await conectando("tablaprb", name, psswd)

  if (dbnamecontr.mensaje === "Err01") return res.json({ auth: false, mensaje: "Verique sus datos." });

  if (!dbnamecontr.nombre === name) return res.json({ "mensaje": "Sin usuarios con ese dato" });
  console.log(dbnamecontr.usser)
  console.log(name)

  if(dbnamecontr.usser!==name) return res.json({ auth: false, mensaje: "Verique sus datos." });

  //________________________________
  const controlPass= await dcryptUserPass(psswd,dbnamecontr.pass)
        

    if(!controlPass) {
      return res.json({ auth: false, mensaje: "Verique sus datos." })
    }else{

      //········· token ···················
      const secret = process.env.SECRET

      const aToken = {
        nombre: dbnamecontr.nombcomp,
        usser:dbnamecontr.usser,
        legajo: dbnamecontr.legajo,
        nivel: dbnamecontr.role

      }
      
      const token = tokenCreate(aToken)

      // console.log(dbnamecontr)
      //····································

      // console.log({
      //   auth: dbnamecontr.auth,
      //   nombre: dbnamecontr.nombcomp,
      //   legajo: dbnamecontr.legajo,
      //   mensaje: "Bienvenido",
      //   usser:dbnamecontr.usser
      // })
      

      return res.json({
        auth: true,
        nombre: dbnamecontr.nombcomp,
        legajo: dbnamecontr.legajo,
        mensaje: "Bienvenido",
        usser:dbnamecontr.usser,
        token:token,
        nivel:dbnamecontr.role

      });
    }
  
})

app.post("/cargadb", async (req, res) => {
  const { data } = req.body


  const dataFecha = data.map(datas => datas.fecha)
  const dataLocal = data.map(datas => datas.local)
  const dataCantidad = data.map(datas => datas.cantidad)
  const dataProducto = data.map(datas => datas.producto)
  const dataId = data.map(datas => datas.id)
  const dataidadb = data.map(datas => datas.idADb)
  const dataObs = data.map(datas => datas.observaciones)

  let dataADb = []
  let dataADb2 = []

  let contador = dataFecha.length

  for (contador; contador > 0; contador--) {
    const tempadb = [dataFecha[contador - 1], dataLocal[contador - 1], parseInt(dataCantidad[contador - 1]), dataProducto[contador - 1], dataId[contador - 1], dataidadb[contador - 1], dataObs[contador - 1]]
    dataADb = [...dataADb, tempadb]
  }

  const tempadb2 = [dataFecha[0], dataidadb[0], dataObs[0]]
  dataADb2 = [tempadb2]

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
    return res.send(result)
  }


})

app.post("/altauser",tokenVal, async (req, res) => {

  console.log("desde altauser: "+req.creator)
  
  const nombreusuario = req.body.data.user
  const nombrecompleto = req.body.data.nombreCompleto
  const userpass = await crypUserPass(req.body.data.pass)
  const creator = req.creator
  const nivel = req.body.data.nivel
  const local = req.body.data.local
  const dni = req.body.data.dni
  const legajo = req.body.data.legajo
  const foto = req.body.data.foto

  const usuarioData = [nombreusuario, userpass, creator, nivel,local,nombrecompleto,dni,legajo]
  console.log("FOTO")
  const fotito = req
  //console.log(fotito)
  

  // ############################

  const userExist = await consultaUsuario("tablaprb", nombreusuario, dni,legajo)
  
  if (!userExist) {
    //console.log(userExist)
    return res.send({
      "mensaje": "Datos existente, consulte los datos"
    })

  }else{

    await crearUsuario("tablaprb",usuarioData)


    //fotito.mv("./fotos/"+legajo+".jpg")

    
    return res.send({
      "mensaje": "Usuario dado de ALTA"
    })
  }

})

app.get("/consexp",(req,res)=>{
  
  const secret = process.env.SECRET
  const cuk = req.query.token

  //console.log("desde /consexp ... token  "+cuk)

  if(!cuk) return res.send({"auth":false})
  
  // if( longitud === 0) return res.send({"auth":false})
  
  const payLoad = jwt.verify(cuk,secret)
  
  const ahora = Date.now()

  if(payLoad.exp < ahora){
    return res.send({"auth":false})
  }

  const auth = payLoad ? true:false
  
  return res.status(200).send({"auth":auth,"nombre":payLoad.nombre,"legajo":payLoad.legajo})
})

app.get("/reading",(req,res)=>{

  const files = fs.readdirSync('./download')
  
  if(files.length===0){
    
    return res.json({"file":0})
    
  }
  return res.json(files)
})

app.get("/downloader",(req,res)=>{
  
  const dwnFile = req.query
  
  const archDesc= "./download/"+dwnFile.file

 try {
   return res.download(path.resolve(archDesc))
   } catch (error) {
   console.log(error)
 }


})

app.post("/upload", async (req,res)=>{

  try {
    if(!req.files){
      res.send({
        status: false,
        message:"No hay archivos"
      })
    }else{
      const {fileup} = req.files
      console.log(req)

      fileup.mv("./download/"+fileup.name)

      res.send({
        status:true,
        message: "Hecho, cargado"
      })

    }
  } catch (error) {
    res.status(500).send(error)
  }

})

app.post("/fotos", async (req,res)=>{

  console.log(req.files)

  try {
    if(!req.files){
      res.send({
        status: false,
        message:"No hay archivos"
      })
    }else{
      const {foto} = req.files
      const {legajo} = req.body
      console.log(req)

      foto.mv("./fotos/"+legajo+".jpg")
      console.log(foto)

      res.send({
        status:true,
        message: "Hecho, cargado"
      })

    }
  } catch (error) {
    res.status(500).send(error)
  }

})


app.get("/delete/", (req,res)=>{
  const delFiles = req.query.file

  const delPath = "./download/"+delFiles

  fs.unlink(delPath,(err)=>{
    if(err){
      console.log(`Error al eliminar archivo ${err}`)
      return 
    }

    console.log(`Archivo ${delFiles}`)

    res.send({"message":`Archivo " ${delFiles} " eliminado`})
  })
})

app.get("/consultadb",tokenVal,async(req,res)=>{

  console.log(req.cookies.token)


  const {tabla} = req.query

try {
  const tablaRes = await consultaLocalNivel(tabla)
  return res.send(tablaRes)

} catch (error) {
  console.log(error)
}


})

app.get("/tnav",(req,res)=>{

  const tokenId = req.query.token

  const navToken = tokenData(tokenId)
  return res.json(navToken)
})

app.get("/prb",prbSite,(req,res)=>{
  console.log("buenas")
  res.send("buennas")
})

app.get("/traslado",(req,res)=>{
  const trlsd = trasladoDbOserv()
  res.json(trlsd)

})

app.get("/personaldb",tokenVal,async(req,res)=>{

  const {dniNombre} = req.query.data
  console.log("desde PersonalDb :"+dniNombre)


  const persona = await personalDb(dniNombre)
  res.json(persona)

})

app.post("/altabm",tokenVal,async(req,res)=>{
 
  const {tabla,altadb} = req.body

  const consultaAdb = await consultaAltaAbm(tabla,altadb)
  
  if(!consultaAdb)return res.send(false)
  
  const aDb = await altaAbm(tabla,altadb)
  console.log("desde endpoint"+aDb)  

  return res.send(true)
})

app.get("/listagral",tokenVal,async(req,res)=>{
  
    console.log(req.query.data)

    const {data}=req.query


    const response = await abmListados(data)

    return res.json(response)


})

app.delete("/abmdelete",tokenVal,async(req,res)=>{

    const {dataId,dataTb,dataValor}=req.query

    const response = await abmBorrarItem(dataId,dataTb,dataValor)
    
    if(!response) return res.send(false)
    return res.send(true)
})

app.get("/coments",tokenVal,async(req,res)=>{

  const datareq = req.query.data 
  
  const consultaCmnt = await comentariosDb(datareq)
  
  console.log(consultaCmnt)
  res.json(consultaCmnt)
  return
})