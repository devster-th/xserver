//nodeFile.js
//test handling files
// _x.do({act:"readFile",fileName:"aaaaa",type:"json"})


var fs = require("fs")

// function //////////////////////////////////////////////////

_x = function (x) { //this can export later

  if (x.act == "readFile") {
    fs.readFile(x.fileName,"utf8", (error,content)=>{
      if (error) throw error 
      if (x.convert =="toObject") {
        content = JSON.parse(content)
      }
      console.log(content)
    })
  }





}



//read 
/*
let readF = function(fileName) {
  return new Promise( (resolve,reject)=> {
    fs.readFile(fileName,"utf8", (error,data)=> {
      if (error) reject(error)
      resolve(data) //just send raw data from the file
    })
  })    
} 
*/

// test ////////////////////////////////////////////////////////

//readF("_xdb.json").then(resolve => console.log(resolve))
_x({act:"readFile",fileName:"_xdb.json",convert:"toObject"})


/* tail note ////////////////////////////////////////////
test=passed
but why we do promisified it while we just simply use the callback, which smaller codes?


*/