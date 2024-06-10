const bcrypt = require("bcryptjs")

const crypUserPass = (psswd) => {
    
    return new Promise((resolve, reject) => {
        const wsecret = psswd
        
        const rondasDeSal = 5
        
        bcrypt.hash(wsecret, rondasDeSal, (err, hash) => {
            if(err){
                console.log(err)
                return err
            }else{
                console.log(`hash:::: ${hash}`)
                return resolve(hash)
            }
        })
    })

}

    
const dcryptUserPass =(psswd,dbPsswd) => {
    
    console.log(`${psswd} ${dbPsswd}`)

    return new Promise((resolve, reject) => {
    
        bcrypt.compare(psswd, dbPsswd, (err, coinciden) => {
            if (err) {
                
                return resolve(false)
            } else {
                
                return resolve(coinciden)
            }
    
        
        })
    })

    }




module.exports = { crypUserPass,dcryptUserPass}