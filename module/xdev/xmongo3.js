/**
 * xmongo3.js - a library to work with mongodb easier
 * @by mutita.org@gmail.com
 * @version 3.0
 * 
 * main objective of this version is to let the xmongo handling cache so it can handle more concurrent users like millions or more. Some other fintunes can be improved as well.
 * 
 * list of key changes:
 * 1. OR_ == done
 * 2. cache
 * 3. <, > for number == done
 * 4. <, > for character
 * 5. auto add uuid == done
 * 6. ObjectId is now support in find command == done
 * 7. change command supports easierFilter
 * 
 */

const uri = 'mongodb://localhost:27017/' //default
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb')

let mongo = new MongoClient(
  uri, 
  /*
  { serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true }
  }
  */
 //take the above block out and the distinctField now work, m20231124
)

const XS = require('./xdev2.js')

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



/**
 * XD.connect() - connects to mongodb.
 */
async function connect(uri='') {
  //allows user to change the uri at connection time
  if (uri) {
    mongo = new MongoClient(uri)
  }

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
      // XD.$({connect: '' | =uri= })

      if (X.connect) {
        // user puts a uri, so sets it
        mongo = new MongoClient(X.connect)
      } else {
        //return {fail: true, msg: "Wrong input."}
        //uses default uri
      }

      try {
        mongo.connect() 
      } catch (error) {
        return {fail: true, msg: error}
      } finally {
        return {success: true, msg: "Connected."}
      }
      break



    //disconnect --------------------------------------
    case 'disconnect':  //OK
      // XD.$({disconnect: '' }) ...don't check value

      try {
        mongo.close()
      } catch (error) {
        return {fail: true, msg: error}
      } finally {
        return {success: true, msg: "Disconnected."}
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

      //if X.add is obj, makes it array
      if (!Array.isArray(X.add)) {

        //check if it already has uuid
        if ('uuid' in X.add) {
          //console.log('already has uuid')
        } else {
          //let uuid = XS.uuid()
          //console.log(uuid)
          X.add.uuid = XS.uuid()
        }
        X.add = [X.add]
      } else {
        //this is insertMany and we have to add uuid in every doc
        //add uuid field if inexistence
        X.add.forEach(x => {
          if ('uuid' in x) {
            //already has
          } else {
            x.uuid = XS.uuid()
          }
        })
      }

      //if no . takes default xdb as db but if has . will take like db.collec
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

      //initial
      global.isFindMax = false
      global.findMaxKey = ''
      global.isFindMin = false 
      global.findMinKey = ''


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
      
      if (X.find instanceof XD.ObjectId) {
        //this is a find by ObjectId
      } else if (typeof X.find == 'object') {

        //filter, this handle the data of the field
        X.find = easierFilter(X.find)

      } else {
        //XD.$({find:'DOC_QTY', from: })
     
        if (X.find == 'DOC_QTY') {
          return mongo
            .db(X.db).collection(X.collec)
            .countDocuments()
        
        } else if (X.find == 'FIRST_DOC') {
          return mongo
            .db(X.db).collection(X.collec)
            .find({}).sort({_id:1}).limit(1)
            .toArray()
        
        } else if (X.find == 'LAST_DOC') {
          return mongo 
            .db(X.db).collection(X.collec)
            .find().sort({_id:-1}).limit(1)
            .toArray()
        }
      }

      


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




      //run mongodb

      if (X.distinctField) {
        //distinct ......not work due to api not support

        return mongo.db(X.db).collection(X.collec)
          .distinct(
            X.distinctField,
            X.find
          )

        //for find:{price:'MAX_'}, ....
      } else if (isFindMax && findMaxKey) {

        return mongo
          .db(X.db).collection(X.collec)
          .find().sort({[findMaxKey]: -1})
          .limit(1).toArray()
      

      } else if (isFindMin && findMinKey) {

        return mongo
          .db(X.db).collection(X.collec)
          .find().sort({[findMinKey]: 1})
          .limit(1).toArray()

      } else {
        //normal block

        return mongo
          .db(X.db).collection(X.collec)
          .find(X.find).project(X.project)
          .sort(X.sort).limit(X.limit)
          .skip(X.skip).toArray()
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
      // { createCollection: =name=, in: =db= }
      return mongo.db(X.in).command(
        {create: X.createCollection}
      )
      break


    // createDb---------------------------------------
    case 'createDb':
      // { createDb: =name= }
      
      //check input is required
      if (!X.createDb) return {fail:true, msg:'Wrong input.'}

      //check the db name must not be existed
      let existingDb = await $({listDb:''})
      if (existingDb.databases.find(
        x => x.name == X.createDb
      )) {
        return {fail:true, msg:'This db already existed.'}
      } 

      //passed above checks
      return mongo.db(X.createDb).command(
        {create: 'xdbConfig'} 
      )
      break
      // this command will always create a collec xdbConfig


    // listDb -------------------------------------------
    case 'listDb':
      // XD.$({listDbName:''})
      return mongo.db('admin').command(
        {listDatabases: 1, //nameOnly: true
        }
      )
      break 


    // listCollectionOf --------------------------------------
    case 'listCollectionOf':
      // XD.$({listCollection: =dbName= })
      return mongo.db(X.listCollectionOf)
        .listCollections().toArray()
      break



    // setIndexAs -----------------------------------------
    case 'setIndexAs':
      // XD.$({setIndexAs:{userName:1}, on:'=db.coll='})
      if (X.on.includes('.')) {
        let part = X.on.split('.')
        X.db = part[0]
        X.collec = part[1]
      } else {
        X.collec = X.on 
      }

      return mongo.db(X.db).collection(X.collec)
        .createIndex(X.setIndexAs)
      break


    // getIndexOf -------------------------------------------
    case 'getIndexOf':
      // XD.$({getIndexOf: =db.coll= })
      if (X.getIndexOf.includes('.')) {
        let part = X.getIndexOf.split('.')
        X.db = part[0]
        X.collec = part[1]
      } else {
        X.collec = X.getIndexOf
      }

      return mongo.db(X.db).collection(X.collec)
        .indexes()
      break


    // searchText -----------------------------------------
    case 'searchText':
      // XD.$({searchText:'=textToSearch=', from:'=db.coll='})
      if (X.from.includes('.')) {
        let part = X.from.split('.')
        X.db = part[0]
        X.collec = part[1]
      } else {
        X.collec = X.from
      }

      return mongo.db(X.db).collection(X.collec)
        .find({$text: {$search: X.searchText }}).toArray()
      break


    // removeIndex -------------------------------------------
    case 'removeIndex':
      // XD.$({removeIndex:=indexName=, from:=db.col=})
      if (X.from.includes('.')) {
        let part = X.from.split('.')
        X.db = part[0]
        X.collec = part[1]
      } else {
        X.collec = X.from
      }

      return mongo.db(X.db).collection(X.collec)
        .dropIndex(X.removeIndex)
      break


    // removeCollection -----------------------------------
    case 'removeCollection':
      // XD.$({removeCollection:=colName=, from:=dbName=})

      return mongo.db(X.from).collection(X.removeCollection)
        .drop()
      break 
      //ok m202311250901

    

    // deleteDb --------------------------------------------
    case 'removeDb':
      // {removeDb:=dbName=}
      return mongo.db(X.removeDb).command(
        {dropDatabase: 1}
      )
      break
      //ok m202311250946


    // renameCollection --------------------------------------
    case 'renameCollection':
      /*  { renameCollection: =oldColName=, to: =newName=
            in: =dbName= }
      */
      return mongo.db('admin').command(
        { renameCollection: X.in + '.' + X.renameCollection , 
          to: X.in + '.' + X.to 
        }
      )
      break 
      //ok m202311261051
      //allows only renaming in the same collection, not cross


    // command ----------------------------------------------
    case 'command':
      // {command: =mongoDbCommand= }
      return mongo.db('admin').command(
        X.command 
      )
      break 
      //ok m202311250946


    
    // copyCollection ---------------------------------------
    case 'copyCollection':
      // {copyCollection: =name=, to: =name=, in: =db= }
      
      //check if the target name existed?
      let existCol = await $({listCollectionOf: X.in})
      let existed = existCol.find(col => col.name == X.to)
      existCol = null

      if (existed) {
        return {fail:true, msg:"The target name already existed."}
      } else {
        //pass test
        return $({createCollection: X.to, in: X.in}).then(
          async re => {
            let copy = await $({find:'', 
              from: X.in +'.'+ X.copyCollection })

            return await $({
              add: copy, 
              to: X.in +'.'+ X.to 
            })
          }
        )
      }
      break
      //ok m202311261219
      //copies col to new one within the same db, all the _id & uuid are carried


    default:
      return {fail:true, msg:'Wrong command.'}
  }
} //$


/**
 * easierFilter() - simplifies the query of mongodb. It takes the query object and then convert to mongodb language.
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
      queryObj[key].match(/^\d+\+$/) /*|| 
      queryObj[key].match(/^>\d+$/)*/ ) {
        var val = queryObj[key].replace('+','')
        /*val = queryObj[key].replace('>','')*/
        queryObj[key] = {$gt: Number(val)}
    }

    //supports > sign
    if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^>.+$/)) {
        var val = queryObj[key].replace('>','')
        if (val.match(/^\d+$/)) {
          //if it's digit makes it number
          queryObj[key] = {$gt: Number(val)}
        } else {
          //if it's words just leave it there
          queryObj[key] = {$gt: val}
        }
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

    //supports < sign
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^<.+$/)) {
        let val = queryObj[key].replace('<','')
        if (val.match(/^\d+$/)) {
          queryObj[key] = {$lt: Number(val)}
        } else {
          queryObj[key] = {$lt: val}
        }
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

    // {price:'100-500'} >> price:{$gte:100}, price:{$lte:500}
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^\d+-\d+$/)) {
        let part = queryObj[key].split('-')
        queryObj[key] = {
          $gte: Number(part[0]), 
          $lte: Number(part[1])
        }
      }

    // find:{time:'BEFORE_2023-11-01T09:00'}, ...
    //the field about time in db must be millisec, always
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^BEFORE_.+$/)) {
        let checkTime = new Date(
          queryObj[key].replace('BEFORE_','')
        ).getTime() 

        queryObj[key] = {$lt: checkTime}
      }

    //AFTER_2023-11-01...
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^AFTER_.+$/)) {
        let checkTime = new Date(
          queryObj[key].replace('AFTER_','')
        ).getTime()

        queryObj[key] = {$gt: checkTime}
      }

    //SINCE_2023-11-01...
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^SINCE_.+$/)) {
        let checkTime = new Date(
          queryObj[key].replace('SINCE_','')
        ).getTime()

        queryObj[key] = {$gte: checkTime}
      }

    //FROM_2023-12-01_TO_2023-12-31
    else if (typeof queryObj[key] == 'string' &&
      queryObj[key].match(/^FROM_.+_TO_.+$/)) {
        let time = queryObj[key].match(/^FROM_(.+)_TO_(.+)$/)
        let fromTime = new Date(time[1]).getTime()
        let toTime = new Date(time[2]).getTime()
        queryObj[key] = {$gte: fromTime, $lte: toTime}
      }


    //find:{price:'MAX_'}
    else if (typeof queryObj[key] == 'string' && queryObj[key].match(/MAX_|LATEST_/)) {
      isFindMax = true
      findMaxKey = key
    }

    //find:{price:'MIN_'}
    else if (typeof queryObj[key] == 'string' && queryObj[key].match(/MIN_|OLDEST_/)) {
      isFindMin = true 
      findMinKey = key
    }

    //for the find:{name:/joh/i} ....this is works automatically as the input is regexp so we not do anything here.
    


  } //end of for..loop


  //return queryObj
  //output now in the queryObj

  //next work on the field name 

  let ky = Object.keys(queryObj)
  let mongoQuer = {}

  for (c=0; c < ky.length; c++) {
    if (ky[c].match(/^OR_.+/) && c > 0) {

      if ('$or' in mongoQuer) {
        let thisKey = ky[c].replace('OR_','')
        mongoQuer.$or.push(
          { [thisKey] : queryObj[ky[c]] }
        )
      } else {
        //$or inexist, so create new
        let thisKey = ky[c].replace('OR_','')
        let prevKey = ky[c-1]
        
        mongoQuer.$or = [
          { [prevKey]: queryObj[prevKey] },
          { [thisKey]: queryObj[ky[c]] }
        ]

        delete mongoQuer[prevKey]
      }
      
    } else {
      //not OR_
      if (true) {
        let thisKey = ky[c]
        mongoQuer[ky[c]] = queryObj[thisKey] 

      }
    }
  }

  queryObj = mongoQuer
  return queryObj
}


module.exports = {info, config, $, ObjectId, connect, disconnect}


/* NOTE

1. auto add uuid into every doc when adding but if it already has, don't touch. == now done. m/20231108

2. now the find supports < & > so that we can do {find:{price:'>100'},...} or price:'<100' == done, m/20231108









*/