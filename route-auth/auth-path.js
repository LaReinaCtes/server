const {conectando} = require("../utils/conectMysql.js");
const express = require("express");
const authRouter = express.Router();
const cors = require("cors");


const cookieParser = require("cookie-parser");

const { v4: uuidv4, stringify } = require("uuid");

//----------------------------------------------

const session = require("express-session");

const MySQLStore = require("express-mysql-session")(session);
//----------------------------------------------
const options = {
  host: "localhost",
  port: 3306,
  user: process.env.MYSQLUSS,
  password:process.env.MYSQLPSS,
  createDatabaseTable: true,
  database: "datasessions",
  clearExpired: true,
  checkExpirationInterval:120000,
  expiration: 1000
};

const sessionStore = new MySQLStore(options);
//----------------------------------------------

authRouter.use(cors());

authRouter.use(cookieParser())

authRouter.use(
  session({
    key: "session_cookie_name",
    secret: "session_secret",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 },
    samesite: "none", secure: true
  })
);

//-----------------rutas protegidas-----------------------------

authRouter.post("/login", async (req, res) => {

  const { name, psswd } = req.body;

  if (!name) return res.json({ mensaje: "Falta el nombre", auth: false });

  const dbnamecontr = await conectando("tablaprb", name, psswd)

  console.log("desde dbnamecontr.mensaje === Err01")

  if (dbnamecontr.mensaje === "Err01") return res.json({ auth: false });

  if (!dbnamecontr.nombre === name) return res.json({ mensaje: "Sin usuarios con ese dato" });

  req.session.passwd = "fj"

  console.log(dbnamecontr)
  
  return res.json({
    auth: true,
    nombre: dbnamecontr.nombre,
    mensaje: "Bienvenido"
  });

});

//####################################################

authRouter.get("/pass",(req, res) => {
const cooky = req.cookies
  console.log(String(cooky.session_cookie_name).replace("s:",""))

  console.log(req.session.cookie.expires)
  console.log("ya estas logueado")

setTimeout(()=>{
  return res.json({"message":"hola","auth":true})},2000)
});

//####################################################

module.exports = authRouter;
