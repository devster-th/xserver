// xmongo.js
// v1.0
// Make it simpler to interact with mongoDb, make it promisified
// mutita.org@gmail.com

/*
USE
    const xmongo = require('./xmongo.js')

    xmongo.newDb('name of new db')
    xmongo.newCol('name of new collection', db)
    xmongo.inserts([{...}, ...], col, db) ....can put just 1 doc
    xmongo.updates({value to update},{query}, col, db) ....can update 1
    xmongo.find({query}, col, db)
*/



const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/'


//test///////////////////////////////////


//newDb('xdatabase')
//newCol('people','xdatabase')
/*
inserts([
  {name:'dad', age:55, sex:'maile', career:'advisor'},
  {name:'mom',age:54, sex:'female', career:'assistant to village head'},
  {name:'john',age:23,sex:'male',career:'student, bachelor year 4'},
  {name:'jane',age:19,sex:'female',career:'student, bachelor year 1'}
  ],
  'people','xdatabase'
)*/

//find({career:/student/},'people','xdatabase').then(op => console.log(op))

//insert({name:'jack ma'},'people','xdatabase')
//updates({country:'china'},{name:/jack/},'people','xdatabase')

//inserts({name:'vincent van goh',country:'some where'},'people','xdatabase')




////////////////////////////////////////

function newDb(dbName) {
  return new Promise( (resolve,reject) => {
    
    mongo.connect(
      url + dbName, // mongodb://localhost:27017/dbName
      (err,dbx) => {
        if (err) reject(err)
        dbx.close()
        resolve('created db: ' + dbName) 
      })
  })
}//m,ok



function newCol(colName, dbName) {
  return new Promise( (resolve,reject) => {
    
    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)
      
      useDb.createCollection(colName, (err,result) => {
        if (err) reject(err)
        dbx.close()
        resolve(result)
      })
    })
  })
}//m,ok










/* use inserts instead
function insert(doc,colName,dbName) {
  return new Promise( (resolve,reject) => {
    
    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)
      
      useDb.collection(colName).insertOne(doc, (err,result) => {
        if (err) reject(err)
        dbx.close()
        resolve(result)
      })
    })
  })
}//m,ok
*/


function inserts(docs,colName,dbName) {
  return new Promise( (resolve,reject) => {
    
    //check input docs
    if (!Array.isArray(docs)) {
      docs = [docs] //if input is only 1 doc, put the array on
    }

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)
      
      useDb.collection(colName).insertMany(docs, (err,result) => {
        if (err) reject(err) 
        dbx.close()
        resolve(result)
      })
    })
  })
}//m,ok



function find(query,colName,dbName,option={/*_id:0*/},qty=0,order={}) {
  //query = {name:/j/}
  //option is projection, e.g., {_id:0, name:1} shows only name

  if (typeof option != 'object') option={_id:0}
  if (typeof qty != 'number') qty = 0
  if (typeof order != 'object') order = {}

  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).find(query).project(option).limit(qty).sort(order).toArray( 

        (err,result) => {
          if (err) reject(err) 
          dbx.close()
          resolve(result) 
        }
      )
    })
  })

  /**
   * added option in the f var so now we can put projection, 20230503
   * Test with ObjectId = ok m20230611
   */
}//m,ok




function updates(value,query,colName,dbName) {
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).updateMany(
        query,
        { $set: value }, 
        (err,result) => {
          if (err) reject(err)
          dbx.close()
          resolve(result)
        }
      )
    })
  })
}//m,ok


//enhance version
function updates2(value,query,colName,dbName) {

  /**
   * created m/20230609
   * added option v
   * 
   *    xdb.updates2({'aaa':'bbb'},{},col,db,'$rename')
   *    
   */

  //check if the first key has no $set or other command
  if (Object.keys(value)[0].match(!/^\$\w+$/)) {
    value = {$set: value}
    //if no $ command, puts $set as default
  }


  //call mongo
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).updateMany(
        query,
        value,  //just pass raw value into it

        (err,result) => {
          if (err) reject(err)
          dbx.close()
          resolve(result)
        }
      )

    })
  })
}




/* NOTE USE , use updates2() instead
function increase(value,query,colName,dbName) {
  // xs.increase({stock:100, price:-10}, {name:'coffee'}, 'product','xdb')

  /**
   * increase f will do only 1 doc at a time to prevent mistake
   */

/*
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).updateOne(
        query,
        { $inc: value }, 
        (err,result) => {
          if (err) reject(err)
          dbx.close()
          resolve(result)
        }
      )
    })
  })
}*/ //ok m/20230606



function deletes(query,colName,dbName) {
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).deleteMany(
        query,
        (err,result) => {
          if (err) reject(err)
          dbx.close()
          resolve(result)
        }
      )
    })
  })
}//ok 20230605 m



function dropCol(colName,dbName) {
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).drop(
        (err,result) => {
          if (err) reject(err)
          dbx.close()
          resolve(result)
        }
      )
    })
  })

  //changed name from drop to dropCol m/20230609
}//ok 20230605 m



function docCount(query,colName,dbName) {
  //count number of doc resulting from the query

  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).countDocuments(query, 

        (err,result) => {
          if (err) reject(err) 
          dbx.close()
          resolve(result) 
        }

      )
    })
  })

  /**
   * ok, m/20230610
   */
}



function distinct(distinctValue,query,colName,dbName) {
  //if we query for countries which picking only 1 distinct name from a collection (or from a query), this is for it.

  //e.g., xmongo.distinct('country',{signedUp:true},'exam','xdb')

  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).distinct(
        distinctValue,
        query, 

        (err,result) => {
          if (err) reject(err) 
          dbx.close()
          resolve(result) 
        }

      )

    })
  })

  /**
   * ok, m/20230610
   */
}


//list collections
function listCollection(query={},dbName='xdb') {
  /**
   * xmongo.listCollection() -- returns col names in array
   * 
   * #use
   *        let c = await xmongo.listCollection()
   * 
   * #test OK, m-202306221721
   * #log
   *    -added query to the var so we can check if the specified collection name existed in the db or not, by: 
   *    xmongo.listCollection({name:'customer'})
   */

  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.listCollections(query,{nameOnly:true}).toArray(
        (err,result) => {
          if (err) reject(err) 
          dbx.close()
          resolve(result) 
        }

      )
    })
  })

}




function isCollection(checkName,dbName='xdb') {
  /**
   * xmongo.isCollection(checkName) -- returns true/false to check if it exists as collection or not.
   * 
   * #use
   *        if (isCollection('xyz') {...}
   * 
   * #test OK, m-202306221934
   * #log
   */

  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,connection) => {
      if (err) reject(err)
      const useDb = connection.db(dbName)

      useDb.listCollections({name:checkName},{nameOnly:true}).toArray(
        (err,result) => {
          if (err) reject(err) 
          connection.close()

          if (result != '') resolve(true)
          else resolve(false) 
        }

      )
    })
  })

}







//list db
function listDb(dbName='xdb') {
  /**
   * listDb() -- returns list of db existed in the connected mongo
   * 
   * #use -- Get the names of the db from output.databases which is the array.
   * 
   * #tested OK, m-202306221818
   */

  return new Promise( (resolve,reject) => {

    mongo.connect(url).then( connection => {
      const dbAdmin = connection.db(dbName).admin()
  
      dbAdmin.listDatabases((err,list) => {
        if (err) reject(err)
        //console.log(list)
        connection.close()
        resolve(list)  
      })
    })

  })
}




function isDb(checkName,dbName='xdb') {
  /**
   * isDb(name) -- returns true if the db exists, false if not.
   * 
   * #use -- if (isDb('xdb')) {...}
   * 
   * #tested OK, m-202306221956
   */

  return new Promise( (resolve,reject) => {

    mongo.connect(url).then( connection => {
      const dbAdmin = connection.db(dbName).admin()
  
      dbAdmin.listDatabases((err,list) => {
        if (err) reject(err)
        //console.log(list)
        connection.close()

        const existed = list.databases.find(d => d.name == checkName)
        
        if (existed) resolve(true)
        else resolve(false)  
      })
    })

  })
}




// export -----------------------------------
module.exports = {
  newDb, 
  newCol, 
  inserts, 
  find, 
  updates, 
  deletes, 
  dropCol, 
  updates2,
  docCount,
  distinct,
  listCollection,
  listDb,
  isCollection,
  isDb 
}


/*
m,ok .......reasonably works 20230501


*/
