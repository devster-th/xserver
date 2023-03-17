//xdev.js .......change to xev.js 
//this is the language, "dev lang" or framework, whatever,
//that makes the dev life easier

/* the language concept

    {   act:"--this is the command--",
        data:"--data involved in the command--",
        from:"--the sender of this command--",
        note:"--note or message to the receiver--",
        id:"--id of this command--",
        secureKey:"--security key that accepts between 2 sides--",
        time:"--sending time--"
    }
    the above is the 7 parts of the command/language but can be varied

    the program that uses xdev puts here in its file:

        const xde = require("./module/xdev.js")

    and then it can issue command to xdev at any line of its codes, e.g.,

        de.v(x) 
        de.v({act:"send form", data:anObject})

    ! changed from xde.v(x) to... de.v(x)
        in browser... deV(x)

*/

// init ////////////////////////////////////////////////////////////////////

const mongo  = require("mongodb").MongoClient 
const crypto = require("crypto")
const uuid   = require("uuid")
const fs     = require("fs")
const xd     = require("./xdb.js")

exports.run = function (x={}) {


// test /////////////////////////////////////////////////////////////////////////


    //{act:"test xdev"}
    if (x.act == "test xdev") {
        log_(x)
        console.log("//xdev test............ok")
    }//pass

    if (x.act =="test xdev 2") {
        log_("yo! 2000")
    }//test result = if we updated the xdev.js without restart the simple.js
    //the new function won't work. =>Must restart simple.js first


    // {act:"test mongoDb"}
    if (x.act =="test mongoDb") {
        log_(x)
      mongo.connect(_server.mongoUrl, (error,dbClient)=> {
        if (error) throw error
        //console.log(Date.now() + "...connected database done")
        const db = dbClient.db("simpleDb")
        
        db.collection("test").find().toArray( (error,result)=>{
            if (error) throw error 
            console.log("//mongoDb test result...")
            console.log(result) 
        })
      })
    }//pass




  
  
  
// data security //////////////////////////////////////////////////////////////  
  
    // { act:"encrypt", data:"-data to encrypt-", key:"-key for enc-" }  
    if (x.act =="encrypt") {
        log_(x)
        let secureKey = crypto.createCipher("aes-128-cbc",x.key)
        let encrypData = secureKey.update(x.data,"utf8","hex")
        encrypData = encrypData + secureKey.final("hex")     
        console.log(encrypData)
        return encrypData
    }//pass
  
  // { act:"decrypt", data:"-encrypted data-", key:"-same key as encrypt-"}
    if (x.act =="decrypt") {
        log_(x)
        let secureKey = crypto.createDecipher("aes-128-cbc",x.key)
        let decrypData = secureKey.update(x.data,"hex","utf8")
        decrypData = decrypData + secureKey.final("utf8")
        console.log(decrypData)
        return decrypData
    }//pass
  
  
    /* { act:"hash", data:"-data to hash-", 
         key:"-key-", algorithm:"sha256", digest:"hex" }
    */
    if (x.act =="hash") {
        log_(x)
        let secureKey = x.key 
        let hashOutput = 
    crypto.createHash(x.algorithm,x.key).update(x.data).digest(x.digest)
        console.log(hashOutput)
        return hashOutput
    }//pass

  
// generate ////////////////////////////////////////////////////////////////////
  // UUID (Universal Unique ID)
  // { act:"generate", code:"uuid", type:"- random / timestamp -" }
  
    if (x.act =="generate") {
        //log_(x)
        if (x.code == "uuid") {
            if (x.type == "random") {
                let output = uuid.v4()
                console.log(output)
                return output 
            }
            if (x.type == "timestamp") {
                let output = uuid.v1()
                console.log(output)
                return output 
            }
        }
        //the xuid is pending because need to figure how to check with previous code

        //use crypto.randomUUID() = not work
        //use nanoid not work too / version problem 
        //uuid works 

        //xuid is timestamp but unique, no duplicate and we can get this code converted to time easily in js.
        if (x.code=="xuid") {
            let code1 = Date.now()
            let code2 = Date.now()
            while (code2==code1) {
                code2 = Date.now()
            }
            return code2.toString() 
        }//work


    }//pass
  
  
  
  
// file command //////////////////////////////////////////////////////////

    //{act:"read file", fileName:"xxxxx", convert:"toObject"}
    if (x.act =="read file") {
        log_(x)
        fs.readFile(x.fileName,"utf8", (error,content)=>{
        if (error) throw error 
        if (x.convert =="toObject") {
            content = JSON.parse(content)
        }
        console.log(content) //real mode may need to return ?
        })
    }//pass

    //{act:"savefile", fileName:"xxxxx"}
    if (x.act =="save file") {
        log_(x)
        fs.writeFile(x.fileName,x.content, (error)=> {
        if (error) throw error
        console.log(`file:${x.fileName} saved`)
        })
    }//pass


    //{act:"deleteFile", fileName:"xxxx"}
    if (x.act =="delete file") {
        log_(x)
        fs.unlink(x.fileName, (error)=>{
        if (error) throw error
        console.log(`file:${x.fileName} deleted`)
        })
    }//pass


    //{act:"renameFile",oldName:"xxxx", newName:"yyyy"}
    if (x.act =="rename file") {
        log_(x)
        fs.rename(x.oldName,x.newName, (error)=> {
        if (error) throw error 
        console.log(`file:${x.oldName} renamed to:${x.newName}`)
        })
    }


// mongoDb /////////////////////////////////////////////////////////////////
    //{ act:"create mongodb", dbName:"aaaa"}
    if (x.act =="create mongoDb") {
        log_(x)
        let url = `mongodb://localhost:27017/${x.dbName}`
        mongo.connect(url, (error,mongo_)=> {
            if (error) throw error
            log_(`db:${x.dbName} created`)
            mongo_.close()
        })

    }//pass

    //{ act:"create mongo collection", dbName:"aaa", collecName:"bbb" }
    if (x.act =="create mongo collection") {
        log_(x)
        let url = "mongodb://localhost:27017"
        mongo.connect(url, (error,mongo_)=> {
            if (error) throw error
            let db = mongo_.db(x.dbName)
            db.createCollection(x.collecName, (error,result)=>{
                if (error) throw error 
                log_(`mongo collection:${x.collecName} created`)
                mongo_.close()
            })
        })
    }//pass
  
    /*{ act:"add doc to mongo", doc:{--}, 
        collecName:"aaa", dbName:"bbb"}
    */
   //do only inserMany here 
    if (x.act =="add mongo doc") {
        log_(x)
        let url = "mongodb://localhost:27017"
        mongo.connect(url, (error,mongo_)=>{
            if (error) throw error 
            let db = mongo_.db(x.dbName)
            db.collection(x.collecName).insertMany(x.doc, (error,result)=>{
                if (error) throw error
                log_(`mongo added ${result.insertedCount} doc into collection:${x.collecName}`)
                mongo_.close()
            })
        })
    }//pass/ changed to insertMany //pass

    //{ act:"find mongo", data:{name:"john"}, dbName:"aaa", collecName:"bbb"}
    /* not use this, use find all instead
    if (x.act =="find mongo") {
        log_(x)
        let url = "mongodb://localhost:27017"
        mongo.connect(url, (error,mongo_)=>{
            if (error) throw error 
            let db = mongo_.db(x.dbName)
            db.collection(x.collecName).findOne(x.data, (error,result)=>{
                if (error) throw error 
                log_(result)
                mongo_.close()
            })
        })
    }//pass
    */

    //{ act:"find mongo", data:{}, dbName:"aaa", collecName:"bbb"}
    //so we only do 'find all' here
    if (x.act =="find mongo") {
        log_(x)
        let url = "mongodb://localhost:27017"
        mongo.connect(url, (error,mongo_)=>{
            if (error) throw error 
            let db = mongo_.db(x.dbName)
    db.collection(x.collecName).find(x.data).toArray( (error,result)=>{
                if (error) throw error 
                log_(result)
                mongo_.close()
            })
        })
    }//pass


// xdb ////////////////////////////////////////////////////////////////
    // { act:"find xdb", data:"*", in:"people" }    
    if (x.act =="find xdb") {
        return xd.b({find:x.data, in:x.in})
    }//pass

    // { act:"create xdb", data:"aaa bbb ccc" }
    if (x.act =="create xdb") {
        xd.b({ create:x.data }) //..data:"collec1 collec2 collec3"
    }//pass

    // { act:"add xdb", data:[{..},{..}, ...], in:"collec" }
    if (x.act =="add xdb") {
        xd.b({ add:x.data, in:x.in })
    }//pass

    /* { act:"edit xdb", find:{name:"john"}, 
         edit:{note:"good guy"},
         in:"people" }
    */
    if (x.act =="edit xdb") {
        xd.b({ find:x.find, edit:x.edit, in:x.in })
    }//work


// convert //////////////////////////////////////////////////////////////////
    //{ act:"convert to xLang", input: inputVar }
    if (x.act =="convert to xLang") {
        return eval("output=" + x.input)
    }//work, the caller should validate data too before use this command




}//end of module xdev.js


// child functions ////////////////////////////////////////////////////////
function log_(x) {
    console.log(x)
}











/* tail note //////////////////////////////////////////////////////////////
devper: @mutita

2022-9-28   will move every func/task to xdev.js and make the xdev is the 
            language engine, so the server/deeji.js calls xdev to work


            now put file, mongo, xdb into this and work

*/