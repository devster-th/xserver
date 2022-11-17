// this is the simpleApp main file = /simpleApp/server.js
// expressjs v4.18.1

//init
var SEVR = {
                appName: "simpleApp",
                version: "1.0",
                startTime: new Date(),
                domain: "localhost",
                port: 2000,
                mongoUrl: "mongodb://localhost:27017/",
                codeGen: {lastXuid: 0, prefix:"deeji-"}
            }
    
//load module
const express   = require("express")
const app       = express()
const mongo     = require("mongodb").MongoClient 
const crypto    = require("crypto")
const uuid      = require("uuid")


//setting
app.use(express.static("webSite"))
app.use(express.json())
//let mongoUrl = "mongodb://localhost:27017/"

/////////////////////////////////////////////////////////////
/*                  TESTING PART
*/
setTimeout( ()=>{

//put all test command here
    console.log("//test server:")
    _v({ test:"server"})

    console.log("//test encrypt the word='yo!' :")
    _v({ encrypt:"yo!"})

    console.log("//test decrypt to get the word='yo!' back:")
    _v({ decrypt:"7061e86aa2e055ae8f480837fe6095ab"})
    
    console.log("//test hash the word='deeji' to sha256:")
    _v({ hash:"deeji", algorithm:"sha256", digest:"hex"})

    console.log("//hash 'deeji' to md5 :")
    _v({ hash:"deeji", algorithm:"md5", digest:"hex"})

    console.log("//gen some of the UUID/random :")
    _v({ generate:"uuid", type:"random"})
    _v({ generate:"uuid", type:"random"})
    _v({ generate:"uuid", type:"random"})

    console.log("//UUID/timestamp")
    _v({ generate:"uuid", type:"timestamp"})
    _v({ generate:"uuid", type:"timestamp"})
    _v({ generate:"uuid", type:"timestamp"})

    console.log("//XUID test")
    _v({ generate:"xuid", qty:10, output:"console"})

    console.log(SEVR)

}, 500)




//test mongo connection
mongo.connect(SEVR.mongoUrl, (error,dbClient)=> {
    if (error) throw error
    //console.log(Date.now() + "...connected database done")
    const db = dbClient.db("simpleDb")
    
    db.collection("test").find().toArray( (error,result)=>{
        if (error) throw error 
        console.log("//database test result...")
        console.log(result) 
    })
})


////////////////////////////////////////////////////////////
/*                  THE TALKING PART
The server talks to external via GET & POST here and then send 'command' to the xDev which will do detail works.
*/
//handling requests
//the app has only 1 GET and 1 POST

app.get("/request", (req,resp)=>{
    console.log(req.method)
    console.log(req.query)
    resp.send(
                `Hello! ${req.query.name}<br>
                Thanks for your message: "${req.query.message}"<br>
                I like it, :-)<br>
                Bye... see you`
            )

//so everything about public request puts here


})

app.post("/3000", (req,resp)=> {
    //console.log(req)
    console.log(req.method)
    console.log(req.body)
    resp.send(req.body)

//now send data back to browser but it still can't show it




})





//listen
app.listen(SEVR.port, ()=>{
    console.log("////////////////////////////////////////////////////////")
    console.log(`${SEVR.startTime} -- simpleApp , port: ${SEVR.port}`)
    console.log(`...This is a tiny server trying to do little things, and makes things minimal and may be used to be a model, for something bigger.
    -- @mutita 
    v1.0.0 / Sep 6, 2022
    `)
    console.log("//some test messages may follows...")
})


/////////////////////////////////////////////////////////////
/*                  THE DETAIL WORKING PART
This part will work through this pattern of command:

    _v({ do:"this", to:"that", ...more verbs...})


example
    _v({ find:{people:"john"}, in:"mainDb" })
    _v({ add:{product:"noodle"}, to:"mainDb" })


So, this part is the _v(x) function
    v() = function
    x = the object that we can pass 'command' into it

*/

function _v(x) {

// test
// { test:"server" }

    if ("test" in x) {
        if (x.test == "server") {
            console.log("Yo!, server test is good...")
        }
    }




// crypto ---- this module is depreciated
// { encrypt:"thisData", putin:"thatVariable" }

    if ("encrypt" in x) {
        

        let secureKey = crypto.createCipher("aes-128-cbc","thisisakey")
        let encrypData = secureKey.update(x.encrypt,"utf8","hex")
        encrypData = encrypData + secureKey.final("hex")
        this
        
        globalThis.encData = encrypData
        console.log(encrypData)


    }

// { decrypt:"thisEncryptedData"}
    if ("decrypt" in x) {
        let secureKey = crypto.createDecipher("aes-128-cbc","thisisakey")
        let decrypData = secureKey.update(x.decrypt,"hex","utf8")
        decrypData = decrypData + secureKey.final("utf8")
        console.log(decrypData)
    }


//    _v({hash:"deeji", algorithm:"sha256", digest:"hex"})
    if ("hash" in x) {
        let secureKey = ""
        let hashOutput = crypto.createHash(x.algorithm,secureKey).update(x.hash).digest(x.digest)
        console.log(hashOutput)
    }

//------------ GENERATION COMMAND -------------------
// UUID (Universal Unique ID)
// { generate:"uuid", putin:"varName" }

    if ("generate" in x) {
        if (x.generate == "uuid") {
            if (x.type == "random") {
                console.log( uuid.v4() )
            }
            if (x.type == "timestamp") {
                console.log( uuid.v1() )
            }
        }



        //use crypto.randomUUID() = not work
        //use nanoid not work too / version problem 
        //uuid works 
    }

// XUID
//  { generate:"xuid", qty:1, output:"varName"}

    if ("generate" in x) {
        if (x.generate == "xuid") {
            for (i=0; i < x.qty; i++) {
                let xuid = Date.now()
                while (xuid == SEVR.codeGen.lastXuid) { //loop until next #
                    xuid = Date.now()
                }
                if (x.output == "console") {
                    console.log(SEVR.codeGen.prefix + xuid)  //stamp id

                }
                SEVR.codeGen.lastXuid = xuid 
            }
        }
    }


} //end of _v(x)









/*---------- LOG/NOTE -----------
6/9/2022 - created this file: /simpleApp/server.js
12.24 - now handle get, post, file at min level
        put express.json() to use so can handle post, seeing req.body now
13.02 - installed & tested mongodb done, v5.0.11

7/9/2022 - put module 'crypto' , test ok since yesterday
        today test hash ok



        -installed uuid, nanoid got errors not match version, but the 'uuid' still work

        uuid.v1() gen timestamp the same # if we call consecutively so mayne not good for the XUID

        *XUID = nexgen UID that it is unique along the time + another idea that we can know which one is before/behide. This is the idea.





*/