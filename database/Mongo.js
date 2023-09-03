const mongoose = require('mongoose')
require('dotenv').config()

 
const MongoDb = function () {
    
    mongoose.connect(process.env.MONGO_CONN).then(() => {
            console.log("MongoDb Connected from telegram server")
        })
}

const sessionSchema = new mongoose.Schema({
    key : {
        type : String,
        require : [true, "Key wasn't given"],
        // unique : true
    },
    data: {
        role: {
            type: Number,
            required: [true, "Role Number must be given"]
        },
        token: {
            type: String,
            required: [true, "Telegram token must be given"]
        },
        expiration: {
            type: Date, 
            required: [true, "Expiration time must be given"]
        },
        issued_time: {
            type: Date,
            dafault: Date.now() 
        }
    }
})

const Session = mongoose.model('Session', sessionSchema)


//Function that add/updates a session to/in the database
MongoDb.prototype.addSession = async function(key, data, callback){
    const userSession = await Session.findOneAndRemove({ key : key })

    const schema = new Session({
        key,
        data
    })
    
    schema.save({
        upsert : true
    }).then(function (retVal){
        const ret = {
            status: true,
            result: {
                msg: "New session added to the db",
                data : retVal
            }
        }
        return callback(ret)
    }).catch(function (errVal){
        const ret = {
            status: false,
            result: {
                msg: "Error while adding the session to the database",
                error : errVal
            }
        }
        return callback(ret)
    })
}

MongoDb.prototype.removeSesseion = async function (key, callback){
    const userSession = await Session.findOneAndRemove({ key : key })

    if (userSession) {
        const ret = {
            status: true,
            result: {
                msg: `Session of user ${key} has been removed.`,
                data : userSession
            }
        }
        return callback(ret)
    }else {
        const ret = {
            status: false,
            result: {
                msg: "Session already removed.",
                data : userSession
            }
        }
        return callback(ret)
    }

    // try {
    //     await Sessions.findOneAndRemove()
    //         .then((data) => {
    //             console.log(data)
                
    //         }).catch((error) => {
    //             console.log(error)
                
    //         })
    // }catch (err) {
    //     console.log("Probably session not found: " + err)
    // }
}

MongoDb.prototype.getSession = async function (key, callback)  {

    const userSession = await Session.findOne({ key : key })

    if (userSession) {
        const ret = {
            status: true,
            result: {
                msg: "Successfuly retured the session of the user",
                data : userSession
            }
        }
        return callback(ret)
    }else {
        const ret = {
            status : false,
            result: {
                msg: "Can not get session from the db",
                data : userSession
            }
        }
        return callback(ret)
    }
        // .then((data) => {
        //     const ret = {
        //         status: true,
        //         result: {
        //             msg: "Successfuly retured the session of the user",
        //             data
        //         }
        //     }
        //     return callback(ret)
        // }).catch((error) => {
        //     const ret = {
        //         status : false,
        //         result: {
        //             msg: error.message || "Can not get session from the db",
        //             error
        //         }
        //     }
        //     return callback(ret)
        // })

}

const db = new MongoDb()

module.exports = { db }