/**
 * xfile2.js - enhanced version of xfile.js
 * @param {object} X 
 * @by mutita.org@gmail.com
 * @version 2.0
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
    //can rename directory too

    return rename(X.rename, X.to)

  } else if (command == 'exist') {
    //XF.$({ exist: 'file_name.txt' })    OK/m
    return exist(X.exist)


  } else if (command == 'readDir') {
    //XF.$({ readDir: '/xserver' })
    //reads what are files in this directory
    //tested OK, m20230918

    return fs.readdirSync(X.readDir)


  } else if (command == 'makeDir') {
    //XF.$({ makeDir: '<<name of new directory>>' })
    //if the named dir already exists, returns false
    //tested OK, m20230918

    if (!fs.existsSync(X.makeDir)) {
      try {
        fs.mkdirSync(X.makeDir)
      } catch (error) {
        return error
      }
    } else {
      return {
        msg: "The file name is dupplicating. Aborted.",
        success: false,
        fail: true
      }
    }


  } else if (command == 'deleteDir') {
    //XF.$({ deleteDir: '<<directory name to be deleted>>' })
    //this will delete sub dir of the specified dir too (recursive)
    //tested OK, m20230918

    fs.rm(
      X.deleteDir,
      {recursive:true, force:true},
      error => {
        if (error) throw error
        return {
          msg:"Directory deletion done.",
          success:true, fail:false
        }
      }
    )



  } else if (command == 'copy') {
    //XF.$({ copy: '<<file to be copied>>', to: '<<target file name>>' })
    //XF.$({ copy: '/xyz.txt', to: '/abc.txt' })
    //tested OK, m20230918

    fs.copyFile(
      X.copy,
      X.to,
      (error) => console.log(error)
    )


  } else if (command == 'copyDir') {
    //XF.$({ copyDir:'<<source dir name>>', to:'<<target dir name>>' })
    //XF.$({ copyDir:'/xyz', to:'/abc' })
    //this is recursive so all files, folders under the source dir will be copied
    //tested OK, m20230918

    fs.cp(
      X.copyDir,
      X.to,
      {recursive:true},
      (error) => console.log(error)
    )


  } else if (command == 'changeModeFile') {
    //XF.$({ changeModeFile: '<<file>>', to: '<<000 - 777>>' })
    //if put ... to:0 ... means mode=000
    //tested OK, works for both file and dir, m20230918

    if (X.to || X.to == 0) {
      if (typeof X.to == 'number') X.to = X.to.toString()
      if (typeof X.to != 'string') return {
        msg: "Wrong input.", success:false, fail:true
      }
    } else {
      return {
        msg:"Wrong input.", success:false, fail:true
      }
    }

    fs.chmod(
      X.changeModeFile,
      X.to,
      (error) => {
        if (error) return error
        else return true
      } 
    )


  } else if (command == 'infoFile') {
    //XF.$({ infoFile:'<<file>>' })
    //XF.$({ infoFile:'/xserver/xserver.js' })
    //show info of both file & dir
    //tested OK, m20230918

    return new Promise((resolve,reject) => {
      fs.stat(
        X.infoFile,
        (error,info) => {
          if (error) reject(error) 
          resolve(info) 
        }
      )
    }) 
    
    


  } else {
    //if reached here, nothing executed, just return msg

    return {
      msg: "Invalid input.",
      fail: true,
      success: false
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