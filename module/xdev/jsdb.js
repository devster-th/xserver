
///////////////////////////////////////////////////////
// JSDB - A very simple json database for node.js  
// jsdb v1.1*

//loads dependent modules
const XF = require('/home/sunsern/xfile/xfile.js')
const XC = require('/home/sunsern/xcrypto/xcrypto.js')

// jsdb object
const jsdb = {
  info: {
    module: 'jsdb',
    brief: 'A very simple json database for node.js',
    version: '1.1',
    license: 'none',
    by: 'M',
    date: '2023-12-01'
  },
  defaultFileName: 'jsdb.json',
  secureFileName: 'jsdb.sec',
  secureMode: true,
  keyFile: '/home/sunsern/key/master.sec',
  active: false, //after check the file program will adjust this
  x: {} //this where the data kept
}



/**
 * jsdb.r - reads data from jsdb
 * @param {string} collec - if blank will read whole db
 * @param {object} query - like {name:'jo'}
 * @returns array if multi doc, obj if only 1 doc found
 * @use jsdb.r() for whole db, 
 *  jsdb('aaa') for whole collec,
 *  jsdb('aaa',{name:'bbb'}) finds specific filter
 * @note query allows only 1 field 
 * @test OK, m20230801
 * @clean OK, m20230801.1122
 */
jsdb.r = function (collec,query) {
  // XS.jsdb.r('person',{name:'john'})
  return new Promise((resolve,reject) => {

    let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

    XF.$({exist: fileToUse}).then(re => {
      jsdb.active = re
      let output = ''

      if (jsdb.active) {
        //read file then work on it
  
        jsdbFile('read').then(re => {
          /*let readd = await XF.$({read:'jsdb.json'})
          jsdb.x = JSON.parse(readd)*/
          
          if (!collec && !query) {
            //if receive blank read, means read all data in db
            output = jsdb.x 
            jsdb.x = {}
            resolve(output) 
      
          } else if (collec && !query) {
            //receive only collec, read whole specified collec
            if (collec in jsdb.x) {
              output = jsdb.x[collec] 
              jsdb.x = {}
              resolve(output) 
              
            } else {
              jsdb.x = {}
              reject(null) 
            }
      
          } else if (collec && query) {
            //receive both collec & query
            if (collec in jsdb.x) {
      
              if (!Object.keys(query).length) {
                //blank query {} means find all
                output = jsdb.x[collec] 
                jsdb.x = {}
                resolve(output) 
        
              } else {
                //has someting in the query
      
                let key = Object.keys(query)
                let kk = key[0]
      
                if (key.length) {
                  //jsdb will support only 1 field query
                  let queryPattern = new RegExp(query[kk],'i')
                  
                  /*return jsdb.x[collec].filter(doc => doc[key].toString().match(queryPattern) )*/
      
                  output = []
                  jsdb.x[collec].forEach(dd => {
                    if (dd[kk]) {
                      if (dd[kk].toString().match(queryPattern) ) output.push(dd)
                    }
                  })
      
                  jsdb.x = {}
                  if (output.length > 1) {
                    resolve(output) 
                  } else {
                    resolve(output[0]) //has only 1 doc returns just obj
                  }
      
                } else {
                  // query == {} means no query, just take all of this collec
                  output = jsdb.x[collec]
                  jsdb.x = {} 
                  resolve(output)
                }
              }
            
            } else {
              jsdb.x = {}
              reject(null)
            }
          }
  
        })//jsdbFile
  
      } else {
        //inactive
        reject(null)
      }
    })
  
    

  })//promise
}//END of jsdb.r


//another name
jsdb.read = jsdb.r





//-------------------------------------------------------
/**
 * jsdb.w - add new data to jsdb, or update existing data
 * @param {string} collec 
 * @param {object} docq 
 * @param {object} update 
 * @returns true if the write success, false if invalid/fail
 * @test tested OK, m20230731
 * @clean OK, m20230801.1216
 */
jsdb.w = function (collec, docq, update) {
  //write mode

  return new Promise( (resolve,reject) => {

    let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName
  
    XF.$({exist: fileToUse}).then(re => {
      jsdb.active = re

      if (jsdb.active) { //now can work further

        jsdbFile('read').then(re => {
          //after read, data will be at jsdb.x
  
          //WRITE-ADD
          if (collec && docq && !update) {
            //this is write mode for new adding data
      
              // write-add block
            if (collec in jsdb.x) {
              //if docq is empty {} just exit
              if (!Object.keys(docq).length) {
                jsdb.x = {}
                reject(false) 
              }
              
              //collec already existed, just push
              if (Array.isArray(docq)) {
                //if array means it's multi-doc
                docq.forEach(d => {
                  d._id = randomWords()
                  d._time = Date.now()
                  jsdb.x[collec].push(d)
                })
              } else {
                //only 1 doc
                docq._id = randomWords()
                docq._time = Date.now()
                jsdb.x[collec].push(docq)
              }
              jsdbFile('write')
      
      
            } else {
              //not exist, add it as new collec
              if (Array.isArray(docq)) {
                docq.forEach(x => {
                  x._id = randomWords()
                  x._time = Date.now()
                })
                jsdb.x[collec] = docq //the doc is already array
              } else {
                docq._id = randomWords()
                docq._time = Date.now()
                jsdb.x[collec] = [docq]
              }
              jsdbFile('write')
            }
      
      
          //WRITE-UPDATE
          } else if (collec && docq && update) {
            //this is write for updatng the old doc
            //this case the docq will be the query input 
            if (collec in jsdb.x) {
              //collection exists, good to go
      
              let qKey = Object.keys(docq)
              if (qKey.length) {
                //valid query
                let qk1 = qKey[0]
                let querPatt = new RegExp(docq[qk1],'i')
                //find & update
                jsdb.x[collec].forEach(dd => {
                  if (dd[qk1]) { //this doc has this field or not
                    if (dd[qk1].match(querPatt) ) {
                      //found then just update it
                      let doneQty = 0
                      for (kk in update) {
                        if (kk == '_id') {
                          //never change the _id
                        } else {
                          dd[kk] = update[kk]
                          doneQty++
                        }
                      }
                      if (doneQty > 0) dd._time = Date.now()
                    }
                  }
                })
                jsdbFile('write')
      
              } else {
                //just a blank query {}, makes it as 'all'
                jsdb.x[collec].forEach(dd => {
                  let doneQty = 0
                  for (kk in update) {
                    if (kk == '_id') {
                      //don't change _id
                    } else {
                      dd[kk] = update[kk]
                      doneQty++
                    }
                  }
                  if (doneQty > 0) dd._time = Date.now()
                })
                jsdbFile('write')
              }
      
            } else {
              //collec not exist
              jsdb.x = {}
              reject(false)
            }
      
          } else {
            //not add, not update, so this is invalid
            jsdb.x = {}
            reject(false)
          }
      
        })//jsdbFile
      
      
      } else {
        //inactive, this is fresh, the first fresh doc always being the write-new doc not write-update
    
        if (collec && docq) {
          //this is first fresh add
          if (Array.isArray(docq)) {
            docq.forEach(x => {
              x._id   = randomWords()
              x._time = Date.now()
            } )
            jsdb.x[collec] = docq
          } else {
            docq._id    = randomWords()
            docq._time  = Date.now()
            jsdb.x[collec] = [docq]
          }
          jsdbFile('write')
  
        } else {
          //invalid input
          reject(false)
        }
      }
    })

    
  
  })//promise
}//END of jsdb.w


//make another name
jsdb.write = jsdb.w //another name



//---------------------------------------------------------
/**
 * jsdb.d - deletes collection or doc
 * @param {string} collec - like 'person'
 * @param {object} query - like {name:'jo'} 
 * @returns deletion in the jsdb, or false if invalid input
 * @status WORKS, m20230731
 * @test need little more clean on msg, m20230801
 */
jsdb.d = async function(collec, query) {
  //delete collec or doc

  let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

  jsdb.active = await XF.$({exist: fileToUse})

  if (jsdb.active) {
    //file exists, good to go

    jsdbFile('read').then(re => {

      if (collec && !query) {
        //this is delete the whole collection
        if (jsdb.x[collec]) {
          delete jsdb.x[collec]
          jsdbFile('write')
        } else {
          jsdb.x = {}
          return false //collec inexists
        }
  
      } else if (collec && query) {
        //delete some docs
  
        if (jsdb.x[collec] && Object.keys(query).length) {
          //has collec & good query, good to go
          let qkey = Object.keys(query)[0]
          let notFinished = true 
          
          while (notFinished) {
            //find index to delete until not found
            let idex = jsdb.x[collec].findIndex(dd => dd[qkey] == query[qkey])
  
            if (idex != -1) {
              jsdb.x[collec].splice(idex,1)
            } else {
              //not found and finished
              notFinished = false
              jsdbFile('write')
            }
          }
          
        } else {
          jsdb.x = {}
          return false
        }
  
      } else {
        //invalid
        return false
      }

    })//jsdbFile


  } else {
    //if inactive, cannot delete anything
    return false
  }
}//END jsdb.d

jsdb.delete = jsdb.d


/**
 * jsdb.import - get a json file to be jsdb.json file
 * @param {string} jsonFile - name of json file to import
 * @returns jsdb.json file
 * @status OK, m20230731
 * @test
 * @note changed the whole code, not test yet, m20230801.1251
 */
/*
jsdb.import = async function(file) {
  if (!file) return false

  let ff = await XF.$({read: file})
  let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

  let re = XF.$({
    write: ff, 
    to: fileToUse
  })
  
  return re.success
}
*/



/**
 * jsdb.backup - backup jsdb.json file to another file
 * @param {string} backupFileName - if blank, default is jsdb_.json
 * @returns a backup file like jsdb_.json
 * @status OK, m20230731 
 */
/*
jsdb.backup = async function(backupFileName) {
  if (!backupFileName) backupFileName = 'jsdb_.json'
  jsdb.x = await XF.$({read:'jsdb.json'})
  XF.$({write:jsdb.x, to:backupFileName }).then(re => {
    jsdb.x = {}
    return re.success
  })
}
*/


//-------------------------------------------------------
/**
 * jsdbFile - internal func helping handle files for jsdb
 * @param {string} mode - 'read' or 'write' 
 * @returns data from jsdb for read mode, for write mode adding data to jsdb, or updating existing data
 * @test OK, m20230801
 * @status works
 */
jsdbFile = async function (mode) {
  //handles file for jsdb, internal func not exported
  //mode is 'read|write'

  if (mode == 'read') {
    //read mode
    if (jsdb.secureMode) {
      let cont = await XF.$({read:jsdb.secureFileName})
      let kk = await XF.$({read:jsdb.keyFile})
      cont = await XC.$({decrypt:cont, key:kk})
      jsdb.x = JSON.parse(cont) 

    } else {
      let cont = await XF.$({read:jsdb.defaultFileName})
      jsdb.x = JSON.parse(cont)
    }

  } else if (mode == 'write') {
    //write mode
    if (Object.keys(jsdb.x).length) {
      //has data to write

      let jsonn = JSON.stringify(jsdb.x)

      if (jsdb.secureMode) {
        let kk = await XF.$({read: jsdb.keyFile})
        let sec = await XC.$({encrypt:jsonn, key:kk})

        let re = await XF.$({
          write:  sec, 
          to:     jsdb.secureFileName
        })
        
        jsdb.x = {}
        return re.success

      } else {
        let re = await XF.$({
          write: JSON.stringify(jsdb.x) , 
          to:    jsdb.defaultFileName
        })
      
        jsdb.x = {}
        return re.success
      }

    } else {
      //don't have data
      return false
    }

  } else {
    //wrong
    return false
  }
}


/**
 * jsdb.changeMode - let we toggle between normal & secure modes
 * @returns jsdb.json if changed to normal mode, if changed to secure mode the file will be jsdb.sec
 * @status works
 * @test OK, m20230802
 */
jsdb.changeMode = async function () {
  //change mode from secure to normal, or vise versa
  /*
  - if inactive, cannot change mode
  - if current mode is secure, changes to normal and vise-versa
  - the files jsdb.sec & jsdb.json just leave them together. But careful to backup the file before you switch the mode because after switch the new file will be writen without notice.
  */
 
  let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

  jsdb.active = await XF.$({exist: fileToUse})

  if (jsdb.active) {
    jsdbFile('read').then(re => {
      if (jsdb.secureMode) {
        //change secure > normal
        jsdb.secureMode = false 
        let re = jsdbFile('write')
        return re //true if success | false if fail

      } else {
        //change normal > secure
        jsdb.secureMode = true 
        let re = jsdbFile('write')
        return re
      }
    })

  } else {
    //inactive, invalid
    return false
  }
}


//randomW is a random code tha containing only a-zA-Z nothing else
function randomWords(length=16) {
  //gen a js var style code contains only a-zA-Z

  let words = ''
  for (i=0; i<length; i++) {
    words += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(
      Math.floor(
        Math.random() * 52
      )
    )
  }
  return words
}//ok

module.exports = {jsdb}



/* devnote
20231130
1) very first write, then read shows empty but if do second read, shows data
2) the very first write, not added the _id
3) after first 'require' then do 'jsdb.r' shows nothing, but second shows

20231201
- all above solved










*/