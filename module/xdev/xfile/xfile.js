//xfile.js
// simplify the file handling in node.js
// v1.0 20230501
// mutita.org@gmail.com
// commands: create, write, append, read, rename, erase
/*
USE
    const xfile = require('xfile.js')

    xfile.create('ffffff.txt')
    xfile.write('this is content','ffffff.txt')
    xfile.read('fffff.txt')
    xfile.append('content ssssssssssss','file.txt')
    xfile.rename('oldname.txt','newname.txt')
    xfile.erase('filename.txt')
    xfile.exist('filename.txt) .....returns true/false
*/

const fs = require('fs')


//test///////////////////////////////

erase('newname.txt')



/////////////////////////////////////

function create(fileName) { 
  return new Promise( (resolve,reject) => {

    fs.open(fileName, 'w', (err,file) => {
      if (err) reject(err)
      //console.log('xfile: created ' + fileName)
      resolve('xfile: created ' + fileName)
    })
  })
  //done
}

function write(content, fileName) {
  return new Promise( (resolve,reject) => {
    
    fs.writeFile(fileName, content, (err) => {
      if (err) reject(err)
      //console.log('xfile: wrote to ' + fileName)
      resolve('xfile: wrote to ' + fileName)
    })
  })
  //done
}

function read(fileName) {
  return new Promise( (resolve,reject) => {

    fs.readFile(fileName, (err,content) => {
      if (err) reject(err) 
      if (content) resolve(content.toString() ) 
      else reject('no file')
    })
  })
  //done
  //m:now try to promisify it
}

function append(content, fileName) {
  return new Promise( (resolve,reject) => {

    fs.appendFile(fileName, content, (err) => {
      if (err) reject(err)
      resolve('xfile: appended to ' + fileName)
    })
  })
  //done
}

function erase(fileName) {
  return new Promise( (resolve,reject) => {

    fs.unlink(fileName, (err) => {
      if (err) reject(err)
      resolve('xfile: deleted file ' + fileName)
    })
  })
  //m=ok
}

function rename(oldName, newName) {
  return new Promise( (resolve,reject) => {

    fs.rename(oldName, newName, (err) => {
      if (err) reject(err)
      resolve('xfile: renamed from ' + oldName + ' to ' + newName)
    })
  })
  //m=ok
}

function exist(fileName) {
  // xfile.exist('fileName') .....gets true if exist, false if not
  
  return new Promise( (resolve,reject) => {

    try {
      if (fs.existsSync(fileName) ) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch(err) {
      console.log(err)
    }
       
    
  })
  //M=ok, 2023-2-21
}

module.exports = {create, write, read, append, erase, rename, exist}




/**
 * 2023-2-20  m/all done, will need to add 'return' clause to all func
 *            m=ok, all done, all is modern promise func
 *            m/changed from xfile.x(...) to xfile.$(...)
 *    M/export all func so now can access like:
 *      xfile.read('aaaaa.txt')
 */

/*
m/ok, all test done. 20230501 
  in append() it appends the new line, is there way to append from the last character?        

*/