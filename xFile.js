//nodeFile.js
//test handling files
// _x.do({act:"readFile",fileName:"aaaaa",type:"json"})


var fs = require("fs")

// function //////////////////////////////////////////////////

_x = function (x) { //this can export later

  //{act:"readFile", fileName:"xxxxx", convert:"toObject"}
  if (x.act == "readFile") {
    fs.readFile(x.fileName,"utf8", (error,content)=>{
      if (error) throw error 
      if (x.convert =="toObject") {
        content = JSON.parse(content)
      }
      console.log(content)
    })
  }//pass

  //{act:"savefile", fileName:"xxxxx"}
  if (x.act =="saveFile") {
    fs.writeFile(x.fileName,x.content, (error)=> {
      if (error) throw error
      console.log(`file:${x.fileName} saved`)
    })
  }//pass


  //{act:"deleteFile", fileName:"xxxx"}
  if (x.act =="deleteFile") {
    fs.unlink(x.fileName, (error)=>{
      if (error) throw error
      console.log(`file:${x.fileName} deleted`)
    })
  }//pass


  //{act:"renameFile",oldName:"xxxx", newName:"yyyy"}
  if (x.act =="renameFile") {
    fs.rename(x.oldName,x.newName, (error)=> {
      if (error) throw error 
      console.log(`file:${x.oldName} renamed to:${x.newName}`)
    })
  }

}





// test ////////////////////////////////////////////////////////

//readF("_xdb.json").then(resolve => console.log(resolve))
_x({act:"readFile",fileName:"_xdb.json",convert:"toObject"})


/*
let content = "yo! this is a content to save in the file"
_x({act:"saveFile",fileName:"testSave.txt",content:content})


//_x({act:"deleteFile",fileName:"testSave.txt"})

_x({act:"renameFile",oldName:"testSave.txt",newName:"yo.txt"})



/* tail note ////////////////////////////////////////////
test=passed
but why we do promisified it while we just simply use the callback, which smaller codes?


*/