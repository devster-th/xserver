// xmongo.js
// v1.0
// try to simplify ways to use mongoDb here
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



function find(query,colName,dbName) {
  //query = {name:/j/}
  return new Promise( (resolve,reject) => {

    mongo.connect(url, (err,dbx) => {
      if (err) reject(err)
      const useDb = dbx.db(dbName)

      useDb.collection(colName).find(query).toArray( 
        (err,result) => {
          if (err) reject(err) 
          dbx.close()
          resolve(result) 
        })
    })
  })
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

module.exports = {newDb, newCol, inserts, find, updates}


/*
m,ok .......reasonably works 20230501


*/