//xmongo.js
//try to simplify ways to use mongoDb here
/**
 * USE
 *    const xmongo = require('./xmongo.js')
 * 
 * SYNTAX
 *    xmongo.$({ createDb:'aaaaaaaaaaaa' })
 *    xmongo.$({ createColl:'bbbbbbbbbbbbbbbbbbbbbbb' })
 *    xmongo.$({ insert:{...}, coll:'bbbb', db:'aaaaaa' })
 *    xmongo.$({ insert:[{...}, ...], coll:'bbb', db:'aaa' })
 * 
 *    xmongo.$({ update: {status:'good'},
 *              to:{ name:/j/ },
 *              coll:'bbbbb',
 *              db:'aaaaaa'
 *    })
 * 
 *    xmongo.$({ find:{}, coll:'bbbb', db:'aaaa' })
 *    xmongo.$({ find:/j/, coll:'bbbb', db:'aaaa' })
 * 
 * EXAMPLE
 *    xmongo.$({ find:{}, coll:'people', db:'main' })
 *      .then(x => console.log(x) )
 * 
 * LIMITATION
 *    this thing works for mongodb in localhost but if we use it separate server may be can just change at the 'url' variable.
 *    we take basic commands: createDb, createColl, insert, update, find that's it. Not includes other commands yet.
 */




const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/'

const createDb = function(dbName) {
  return new Promise( (resolve,reject) => {
    
    // createDb('name')
    mongo.connect(url + dbName, (err,db) => {
      if (err) reject(err)
      //console.log('created db:' + dbName)
      db.close()
      resolve('created db:' + dbName) 
    })
  })
  //testing
}

const createColl = function(dbName,collName) {
  return new Promise( (resolve,reject) => {
    
    //create new collec
    mongo.connect(url, (err,db) => {
      if (err) reject(err)
      const dbo = db.db(dbName)
      
      dbo.createCollection(collName, (err,result) => {
        if (err) reject(err)
        //console.log('created collection:' + collName + ' in db:' + dbName)
        //console.log(result)
        db.close()
        resolve(result)
      })
    })
  })
  //done
}

const insert = function(dbName,collName,doc) {
  return new Promise( (resolve,reject) => {
    
    mongo.connect(url, (err,db) => {
      if (err) reject(err)
      const dbo = db.db(dbName)
      
      dbo.collection(collName).insertOne(doc, (err,result) => {
        if (err) reject(err)
        //console.log('inserted 1 doc in collection:' + collName + ', db:' + dbName)
        //console.log(result)
        db.close()
        resolve(result)
      })
    })
  })
  //done
}

const insertMany = function(dbName,collName,docs) {
  return new Promise( (resolve,reject) => {
    //docs = array of obj
    
    mongo.connect(url, (err,db) => {
      if (err) reject(err)
      const dbo = db.db(dbName)
      
      dbo.collection(collName).insertMany(docs, (err,result) => {
        if (err) reject(err) 
        //console.log('inserted ' + res.insertedCount + ' docs in collection:' + collName + ', db:' + dbName)
        //console.log(result)
        db.close()
        resolve(result)
      })
    })
  })
  //done
}

const find = function(dbName,collName,query) {
  //query = {name:/j/}
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,db) => {
      if (err) reject(err)
      const dbo = db.db(dbName)

      dbo.collection(collName).find(query).toArray( (err,result) => {
        if (err) reject(err) 
        //console.log(result)
        db.close()
        resolve(result) 
      })
    })
  })
  //done
}

/* this one may not use, use only updateMany is enough
async function update(dbName,collName,query,value) {
  //value = {country:'thailand}
  mongo.connect(url, (err,db) => {
    if (err) throw err 
    const dbo = db.db(dbName)
    dbo.collection(collName).updateOne(
      query,
      { $set: value }, 
      (err,result) => {
        if (err) throw err
        //console.log('updated 1 doc to collection:' + collName + ', db:' + dbName)
        //console.log(result)
        db.close()
        return result 
      }
    )
  })
}
*/

const updateMany = function(dbName,collName,query,value) {
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,db) => {
      if (err) reject(err)
      const dbo = db.db(dbName)

      dbo.collection(collName).updateMany(
        query,
        { $set: value }, 
        (err,result) => {
          if (err) reject(err)
          //console.log('updated ' + res.result.nModified + ' docs to collection:' + collName + ', db:' + dbName)
          //console.log(result)
          db.close()
          resolve(result)
        }
      )
    })
  })
  //done
}

//this func will refine the way to interact with mongoDb
exports.$ = async function (x) {
  //x = obj
  /**
   * xmongo.$({createDb:'dbName'})
   * xmongo.$({createColl:'collName', db:'ddddddddd'})
   * 
   * xmongo.$({ insert:{...},
   *        coll:'ccccc',
   *        db:'dddddd' 
   * })
   * 
   * xmongo.$({ insert:[
   *          {...},
   *          {...},
   *          ...
   *         ],
   *          coll:'cccc',
   *          db:'ddddd'
   * })
   * 
   * xmongo.$({ find:{ name:/j/ },
   *        coll:'ccccc',
   *        db:'dddddd'
   * })
   * 
   * xmongo.$({ update: {country:'thailand'},
   *        to: {name:/j/},
   *        coll:'ccc',
   *        db:'dddd'
   * })
   */

  if ('createDb' in x) {
    return createDb(x.createDb)
    //testing
  }

  if ('createColl' in x) {
    // xmon.go({ createColl:'cccccccc' })
    return createColl(x.db, x.createColl)
    //done
  }

  if ('insert' in x) {
    // xmongo({ insert:{...}, coll:'cccc', db:'ddddddd' })
    // xmongo({ insert:[.....], ... })
    if (typeof x.insert == 'object') {
      if (Array.isArray(x.insert) ) {
        //insert many
        return insertMany(x.db, x.coll, x.insert)
      } else {
        //insert 1
        return insert(x.db, x.coll, x.insert)
      }
    }
    //done
  }

  if ('find' in x) {
    // xmongo({ find:{...}, db:'ddddd', coll:'cccccc' })
    return find(x.db, x.coll, x.find)
    //done
  }

  if ('update' in x) {
    /* xmongo({ update:{status:'good'},
                to:{name:/j/},
                coll:'ccccc',
                db:'ddddd'
              })
    */
    return updateMany(x.db, x.coll, x.to, x.update)
    //done
  }

  //done 2023-2-19, M
}