const jwt = require("jsonwebtoken")

require("dotenv").config();


const secret = process.env.SECRET

const tokenCreate = (data0)=> {

    const uss = data0.usser
    const nombre = data0.nombre
    const legajo = data0.legajo
    const nivel = data0.nivel


    const token = jwt.sign({
        uss,
        nombre,
        legajo,
        nivel,
        exp:Date.now() + 600 * 1000
    },secret)

    return token

}

const verifToken = async (req,res,next)=>{
    
    const {token} = req.cookies

    console.log("Cookie token "+token)

    if(!token) next(new Error("Sin Token Cris"))
    
    try {
        const verTok = jwt.verify(token,process.env.SECRET)

        if(verTok.exp < Date.now()) console.log("ya paso")
        
        console.log(verTok.exp)
        console.log(Date.now())
    
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
        
    } catch (error) {
        console.log(error)


        res.json({"tokenError":true})

    }
    
    next()
}

const tokenData = (token)=>{

    if(!token) return res.json({"tokenError":true})

    const payLoad = jwt.verify(token,secret)
    
    return {
        "usuario":payLoad.uss,
        "nombreUsuario":payLoad.nombre,
        "legajo":payLoad.legajo,
        "nivel":payLoad.nivel
    }
}

module.exports = {tokenCreate, verifToken, tokenData}
