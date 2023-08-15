/**
 * xfile2.js - enhanced version of xfile.js
 * @param {object} X 
 * @by mutita.org@gmail.com
 * @version 0.2
 * @license none
 * @lastUpdated 2023-07-25
 * 
 * EXAMPLE
 *    XF = require('./xfile2')
 *    XF.$({ read:'file_name.json' })
 *    XF.$({ write:'--content--', to:'file_name.json' })
 *    XF.$({ create:'file_name.json' })
 *    XF.$({ append:'--content--', to:'file_name.json' })
 *    XF.$({ rename:'old_name.json', to:'new_name.json' })
 *    XF.$({ exist:'file_name.json' }) ...gets true|false
 */

const fs = require('fs')

//this is front end 
async function $ (X={}) {

  let command = Object.keys(X)[0]
  if (!command) {
    return {
      fail: true,
      msg: "Command can not be emptied."
    }
  }

  if (command == 'create') {
    //XF.$({create:'file_name.json'})     OK/m
    return create(X.create)
  
  } else if (command == 'write') {
    //XF.$({write: content, to: 'file_name.json'})    OK/m
    return write(X.write, X.to)
  
  } else if (command == 'read') {
    //XF.$({read:'file_name.txt'})    OK/m
    return read(X.read)
  
  } else if (command == 'append') {
    //XF.$({append:'--content--', to:'file_name.txt'})    OK/m
    return append(X.append, X.to)

  } else if (command == 'delete') {
    //XF.$({delete:'file_name.txt'})      OK/m
    return erase(X.delete)

  } else if (command == 'rename') {
    //XF.$({rename:'old_file_name.txt', to:'new_name.txt'})   OK/m
    return rename(X.rename, X.to)

  } else if (command == 'exist') {
    //XF.$({ exist: 'file_name.txt' })    OK/m
    return exist(X.exist)
  
  } else {
    return {
      msg: "Invalid input.",
      fail: true
    }
  }
}



//these are back ends
function create(fileName) { 
  return new Promise( (resolve,reject) => {

    fs.open(fileName, 'w', (err,file) => {
      if (err) reject(err)
      //console.log('xfile: created ' + fileName)
      resolve({
        success: true,
        msg: "A file created."
      })
    })
  })
  //done
}

function write(content, fileName) {
  return new Promise( (resolve,reject) => {
    
    fs.writeFile(fileName, content, (err) => {
      if (err) reject(err)
      //console.log('xfile: wrote to ' + fileName)
      resolve({
        success: true,
        msg: "Wrote to the file."
      })
    })
  })
  //done
}

function read(fileName) {
  return new Promise( (resolve,reject) => {

    fs.readFile(fileName, (err,content) => {
      if (err) reject(err) 
      if (content) resolve(content.toString() ) 
      else reject({
        fail: true,
        msg: "Something wrong with the content."
      })
    })
  })
  //done
  //m:now try to promisify it
}

function append(content, fileName) {
  return new Promise( (resolve,reject) => {

    fs.appendFile(fileName, content, (err) => {
      if (err) reject(err)
      resolve({
        success: true,
        msg: "Appended to the file."
      })
    })
  })
  //done
}

function erase(fileName) {
  return new Promise( (resolve,reject) => {

    fs.unlink(fileName, (err) => {
      if (err) reject(err)
      resolve({
        success: true,
        msg: "Deleted the file."
      })
    })
  })
  //m=ok
}

function rename(oldName, newName) {
  return new Promise( (resolve,reject) => {

    fs.rename(oldName, newName, (err) => {
      if (err) reject(err)
      resolve({
        success: true,
        msg: "Renamed the file."
      })
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
      reject(err)
    }
       
    
  })
  //M=ok, 2023-2-21
}

module.exports = { $ }




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