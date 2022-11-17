//nodeFile.js
//test handling files
// _x.do({act:"readFile",fileName:"aaaaa",type:"json"})


var fs = require("fs")

xfile = function (x) { //this can export later

  if (x.act == "readFile") {
    readF(x.fileName).then(resolve => {
      if (x.convert == "toObject") {
        resolve = JSON.parse(resolve)
      } 
      console.log(resolve)
    })
  }
}



//read
let readF = function(fileName) {
  return new Promise( (resolve,reject)=> {
    fs.readFile(fileName,"utf8", (error,data)=> {
      if (error) reject(error)
      resolve(data) //just send raw data from the file
    })
  })    
}

//readF("_xdb.json").then(resolve => console.log(resolve))
xfile({act:"readFile",fileName:"_xdb.json",convert:"toObject"})


/* tail note ////////////////////////////////////////////
test=passed
but why we do promisified it while we just simply use the callback, which smaller codes?


*/