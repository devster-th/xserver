/**
 * xmongo2.js - a library to work with mongodb easier
 * @by mutita.org@gmail.com
 * @version 2.0
 * 
 */

const uri = 'mongodb://localhost:27017/'
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb')

const mongo = new MongoClient(
  uri, 
  { serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true }
  }
)

const info = {
    software:'xmongo.js',
    version:'2.0',
    by:'mutita.org@gmail.com',
    license:'none'
}

const config = {
  host:'localhost',
  port:'27017',
  userName:'SUPERADMIN',
  password:"c'CyVV/kzRDC"
}

/*
async function testDb(dbName='admin') {
  try {
    await mongo.connect()
    await mongo.db(dbName).command({ping:1})
    console.log("Successfully connected.")
  } finally {
    await mongo.close()
  }
  
}

async function find(X={}) {
  if (!X.db) X.db = 'xdb'
  if (!X.collec) X.collec = 'user'
  if (!X.query) X.query = {}

  try {
    await mongo.connect()
    
    const found = await mongo.db(X.db).collection(X.collec).find(
      X.query
    ).toArray()

    return found

  } finally {
    await mongo.close()
  }
}
*/

/**
 * XD.connect() - connects to mongodb.
 */
async function connect() {
  try {
    mongo.connect()
  } catch (error) {
    return {fail: true, msg: error}
  } finally {
    return {success: true, msg: "Connected."}
  }
}

/**
 * XD.disconnect() - disconnects the mongodb.
 */
async function disconnect() {
  try {
    mongo.close()
  } catch (error) {
    return {fail: true, msg:"Fail to disconnect."}
  } finally {
    return {success: true, msg:"Disconnected."}
  }
}

/**
 * XD.$({..}) - new version of the xmongo.js
 */
async function $(X={}) {

  //checking
  if (!X.db) X.db = 'xdb'
  X.collec = ''
  if (!X.find) X.find = {}
  if (!X.limit) X.limit = 0
  if (!X.skip) X.skip = 0
  if (!X.sort) X.sort = {}
  if (!X.project) X.project = {}


  //run
  switch (Object.keys(X)[0]) {

    //connect -------------------------------------------
    case 'connect':   //OK
      // XD.$({connect:true})

      if (X.connect == true) {
        try {
          mongo.connect() 
        } catch (error) {
          return {fail: true, msg: error}
        }
        return {success: true, msg: "Connected."}
      } else {
        return {fail: true, msg: "Wrong input."}
      }
      
      break



    //disconnect --------------------------------------
    case 'disconnect':  //OK
      // XD.$({disconnect:true})

      if (X.disconnect == true) {
        try {
          mongo.close()
        } catch (error) {
          return {fail: true, msg: error}
        }
        return {success: true, msg: "Disconnected."}
      } else {
        return {fail: true, msg: "Wrong input."}
      }
      
      break



    //add -------------------------------------------
    case 'add':  //OK
      // { add: {...}, to:'db.collec' }
      if (!X.add || !X.to) {
        return {
          fail: true,
          msg: "Can not add empty data."
        }
      }

      //if X.insert is obj, makes it array
      if (!Array.isArray(X.add)) {
        X.add = [X.add]
      }

      if (X.to.includes('.')) {
        let part = X.to.split('.')
        X.db = part[0]
        X.collec = part[1]
      } else {
        X.collec = X.to
      }


      return mongo
        .db(X.db)
        .collection(X.collec)
        .insertMany(X.add)

      break 



    //delete -------------------------------------------
    case 'delete':  //OK
      // { delete: {..query..}, from:'db.collec' }
      if (!X.delete || !X.from) {
        return {
          fail: true,
          msg: "No data to delete."
        }
      }

      if (X.from.includes('.')) {
        let part = X.from.split('.')
        X.db = part[0]
        X.collec = part[1]
      } else {
        X.collec = X.from
      }

      return mongo
        .db(X.db)
        .collection(X.collec)
        .deleteMany(X.delete)

      break 


    //find ----------------------------------------------
    case 'find':  //OK
      /* {  find: {..query..},
            from: 'xdb.product' ,
            getOnly: 'name price stock',
            distinctField: 'country' //not support
          }
      */

      //check db & collec
      if (X.from) {
        if (X.from.includes('.')) {
          part = X.from.split('.')
          X.db = part[0]
          X.collec = part[1]
        } else {
          X.collec = X.from 
        }
      }
      

      //filter
      X.find = easierFilter(X.find)

      //getOnly:'name price stock'      =OK/m
      //this is easier projection
      if (X.getOnly) {
        let part = X.getOnly.split(' ')
        
        part.forEach(p => {
          X.project[p] = 1
        })

        if ('_id' in X.project) {} else {
          //if not specify _id , puts it off
          X.project._id = 0
        }
      }

      if (X.distinctField) {
        //distinct

        return mongo.db(X.db).collection(X.collec)
          .distinct(
            X.distinctField,
            X.find
          )


      } else {
        //normal block

        return mongo
        .db(X.db)
        .collection(X.collec)
        .find(X.find)
        .project(X.project)
        .sort(X.sort)
        .limit(X.limit)
        .skip(X.skip)
        .toArray()
      }
      
      break 



    //replace --------------------------------------------
    /* the Replace replaces the entire doc while the Update only updates the fields we specified, that's the different. */
    case 'replace': //OK
      /*  { replace:{..query..}, with:{..}, on:'db.collec' }
      */
      if (!X.replace || !X.with || !X.on) {
        return {
          fail: true,
          msg: "Invalid input."
        }
      }

      if (X.on.includes('.')) {
        let part = X.on.split('.')
        X.db = part[0]
        X.collec = part[1]
      }

      return mongo
        .db(X.db)
        .collection(X.collec)
        .replaceOne(X.replace, X.with)
      break


    //change ---------------------------------------------
    case 'change':  //OK
      // {  update: {..query..}, with: {$set:{..}}, 
      //    db:'--', collec:'--'  }
      /* NOTE
          For easy mode right now we only for only simple update but if there's more complex such as updating multiple operations together, may be problem. 
          --SOLVED, now working in complex statement for: $set, $unset, $inc, $mul, $rename
      */

      //valid check
      if (!X.change || !X.with || !X.to) {
        return {
          fail: true,
          msg: "Invalid input."
        }
      }

      //easier db & collec
      if (X.to) {
        if (X.to.includes('.')) {
          part = X.to.split('.')
          X.db = part[0]
          X.collec = part[1]
        } else {
          X.collec = X.to
        }
      }

      //easierUpdate -------------------------------------OK/m 
      // with:{ price: '+100' } | with:{ price: '-100' }
      if (Object.keys(X.with)[0].match(/^\$.+$/) ) {
        //this is pure mongo update operator like $set


      } else {
        //this is easy mode
        let easyMode = {  //use to hold all the conversions
          set: {}, inc: {}, mul: {}, rename: {}, unset: {}
        } 

        for (key in X.with) {

          // with:{price: '+100'} ...or '-100'    -----OK/m
          // {$inc:{aaa: 100}}
          if (typeof X.with[key] == 'string' && 
            X.with[key].match(/^[+-]\d+$/) ) {

              let resetVal = Number( X.with[key] )
              easyMode.inc[key] = resetVal
          } 

          // with:{price: '*1.1'}                   ----OK/m
          // {$mul:{aaa: 100}}
          else if (typeof X.with[key] == 'string' &&
            X.with[key].match(/^\*[0-9.]+$/) ) {

              let resetVal = Number(X.with[key].replace('*','') )
              easyMode.mul[key] = resetVal
          }   

          // with:{aaa:'RENAMETO_bbb'}                ---OK/m
          // {$rename: {aaa: 'bbb' }}
          else if (typeof X.with[key] == 'string' && 
            X.with[key].includes('RENAMETO_')) {

              let resetVal = X.with[key].replace('RENAMETO_','')
              easyMode.rename[key] = resetVal
          }

          // with:{aaa:'REMOVE_'}
          // {$unset:{aaa:'', bbb:'', ...}}
          else if (typeof X.with[key] == 'string' &&
            X.with[key].includes('REMOVE_')) {

              easyMode.unset[key] = ''
            }

          else {
            //this is general $set
            easyMode.set[key] = X.with[key]
          }
        }

        //merge all to an update statement
        X.with = {
          $set: easyMode.set, 
          $inc: easyMode.inc,
          $mul: easyMode.mul,
          $rename: easyMode.rename,
          $unset: easyMode.unset 
        }

      }//easy mode

      //run
      return mongo
        .db(X.db)
        .collection(X.collec)
        .updateMany(X.change, X.with)
      break

    // createCollection -----------------------------
    case 'createCollection':
      // { createCollection: 'nameOfCollec', db: }
      return mongo.db(X.db).command(
        {create: X.createCollection}
      )
      break




    default:
      return {fail:true}
  }
} //$


/**
 * easierFilter() - simplifies the query of mongodb
 * @param {object} queryObj - the query object in easier format
 * @return {object} queryObj -  query obj in mongodb format
 */
function easierFilter(queryObj) {

  //check
  if (!queryObj) {
    return {
      fail: true,
      msg: "Input can not be empty."
    }
  }


  for (key in queryObj) {

    // > ... {price:'100+'} =OK/m
    if (typeof queryObj[key] == 'string' && 
      queryObj[key].match(/^\d+\+$/) ) {
        const val = queryObj[key].replace('+','')
        queryObj[key] = {$gt: Number(val)}
    }

    // >= ... {price:'>=100'} =OK/m
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^>=\d+$/) ) {
        var resetVal = queryObj[key].replace('>=','')
        queryObj[key] = {$gte: Number(resetVal)}
      }

    // < .... {price:'100-'} =OK/m
    else if (typeof queryObj[key] == 'string' && 
      queryObj[key].match(/^\d+\-$/)) {
        const val = queryObj[key].replace('-','')
        queryObj[key] = {$lt: Number(val)}
      }

    // =< ... {price:'=<100'}  =OK/m
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^=<\d+$/) ) {
        var resetVal = queryObj[key].replace('=<','')
        queryObj[key] = {$lte: Number(resetVal)}
      }

    // NOT_ ... {name:'NOT_john'} =OK/m
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^NOT_/) ) {
        var resetVal = queryObj[key].replace('NOT_','')
        if (resetVal.match(/^\d+$/)) {resetVal = Number(resetVal)}
        queryObj[key] = {$ne: resetVal}
      }

    // EXIST_ ... {name:'EXIST_'} =OK/m
    else if (queryObj[key] == 'EXIST_') {
      queryObj[key] = {$exists: true}
    }

    // INEXIST_ ... {name:'INEXIST_'} =OK/m
    else if (queryObj[key] == 'INEXIST_') {
      queryObj[key] = {$exists: false}
    }

    // abc* ... {name:'abc*'} ... starts with abc     OK/m
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^.+\*$/) ) {

        let resetVal = queryObj[key].replace('*','')
        eval(`queryObj[key] = /^${resetVal}/`)
      }

    // *abc ... {name:'*abc'} ... ends with abc     OK/m
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/\*.+$/) ) {

        let resetVal = queryObj[key].replace('*','')
        eval(`queryObj[key] = /${resetVal}$/`)
      }


  } //end of for..loop
  return queryObj
}


module.exports = {info, config, $, ObjectId, connect, disconnect}



/* SIMPLE DOC

IMPORT INTO YOUR MAIN PROGRAM
  const XD = require('./xmongo2')

ADD
  Add command is the insert in general database command.
  XD.$({add:{..doc..}, to:'db.collec'})

CHANGE
  Change is update in other db language.
  XD.$({change:{..query..}, on:'db.collec', with:{..doc..} })
    
REPLACE


DELETE


FIND
  XD.$({find:{..query..}, from:'db.collec', getOnly:'aaa bbb ccc' })




*/