//xfile.js
// simplify the file handling in node.js
// commands: create, write, append, read, rename, delete

const fs = require('fs')

exports.create = function (fileName) { 
  return new Promise( (resolve,reject) => {

    fs.open(fileName, 'w', (err,file) => {
      if (err) reject(err)
      //console.log('xfile: created ' + fileName)
      resolve('xfile: created ' + fileName)
    })
  })
  //done
}

exports.write = function (fileName, content) {
  return new Promise( (resolve,reject) => {
    
    fs.writeFile(fileName, content, (err) => {
      if (err) reject(err)
      //console.log('xfile: wrote to ' + fileName)
      resolve('xfile: wrote to ' + fileName)
    })
  })
  //done
}

exports.read = function(fileName) {
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

exports.append = function (fileName, content) {
  return new Promise( (resolve,reject) => {

    fs.appendFile(fileName, content, (err) => {
      if (err) reject(err)
      resolve('xfile: appended to ' + fileName)
    })
  })
  //done
}

exports.erase = function (fileName) {
  return new Promise( (resolve,reject) => {

    fs.unlink(fileName, (err) => {
      if (err) reject(err)
      resolve('xfile: deleted file ' + fileName)
    })
  })
  //m=ok
}

exports.rename = function (oldName, newName) {
  return new Promise( (resolve,reject) => {

    fs.rename(oldName, newName, (err) => {
      if (err) reject(err)
      resolve('xfile: renamed from ' + oldName + ' to ' + newName)
    })
  })
  //m=ok
}

exports.exist = function (fileName) {
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

exports.$ = async function (x) {
  /*  xfile.$({create:'fileName'})
      xfile.$({write:'fileName', content:....})
      ...{append:'fileName', content:.....}
      ...{read:'fileName'}
      ...{rename:'oldName',to:'newName'}
      ...{delete:'fileName'}

      ! for text file only
  */

  if (Object.keys(x)[0] == 'create') {
    return await create(x.create)
  }
  if (Object.keys(x)[0] == 'write') {
    return await write(x.write, x.content)
  }
  if (Object.keys(x)[0] == 'append') {
    return await append(x.append, x.content)
  }
  if (Object.keys(x)[0] == 'read') {
    return await read(x.read)
  }
  if (Object.keys(x)[0] == 'rename') {
    return await rename(x.rename, x.to)
  }
  if (Object.keys(x)[0] == 'delete') {
    return await erase(x.delete)
  }


}

//create('test2.txt')
//write('test.txt', 'yo!')
//read('test.txt')
//append('test.txt','this is to append into a file')
//erase('test.txt')
//rename('test2.txt','this_is_new_name.txt')
//rename('this_is_new_name.txt', 'file.txt')


/**
 * 2023-2-20  m/all done, will need to add 'return' clause to all func
 *            m=ok, all done, all is modern promise func
 *            m/changed from xfile.x(...) to xfile.$(...)
 *    M/export all func so now can access like:
 *      xfile.read('aaaaa.txt')
 */