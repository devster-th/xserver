// xdb_s.js
/**
 * this is a simple localStorage database, utilizing json format but keeps all data in the localSto
 * <script src='./xdb.js'></script>
 * xdb() ....shows all data in the db
 * xdb('people.name:j') ......find who has j in the name in 'people' collection
 */

//2023-2-21 M/converting this code to node.js

const xfile = require('/home/mutita/Dev/simpra/module/xfile/xfile.js')
const xdbFile = 'xdb.json'
var _xdb = {}
var xOutput = null

// test ------------------------------

//xdb({people:{name:'jack',age:5555,sex:'ssssssssssssss'}})
//xdb()

//problem is how to work to show result in console


//------------------------------------

exports.$ = async function (v) {
  //xdb should act like a file system that receives commands and responses, so shouldn't keep it in memory

/*
  //try to keep the _xdb in memory
  if (typeof _xdb == 'undefined') {
    if (localStorage.getItem('_xdb') == null) {
      globalThis._xdb = {}
    } else {
      globalThis._xdb = read()
    }
  } else {
    // _xdb already in memory
  }
  //console.log(_xdb)
*/
  //return 5555555555  
  return new Promise( (resolve,reject) => {

    xfile.exist(xdbFile).then(yes => { //<<=======*****
      //console.log(yes)
      if (yes) {
        xfile.read(xdbFile).then(s => {
          //console.log(s)
          _xdb = fromJson(s) 
          //console.log(_xdb)
          resolve( run() ) 
        })
      } else { //file inexist
        xfile.write(xdbFile, toJson({})) //put blank x in blank file
        //return 'xdb: new xdb.json created'
        resolve( run() )
      }
    })
  })

  
  

//this point is the end of the $ func

  function run() { //wrap old codes and put into the above points

///////////////////////////////////////////////////////////////////
    // N O T H I N G ---------------------------------------------
    if (Object.keys(_xdb).length == 0 && v==undefined) {
      //console.log('nothing in the xdb yet')
      return {} 
      //xOutput = {}
    } //review
    

    // A L L --------------------------------------------------
    else if (Object.keys(_xdb).length > 0 && v==undefined) {
      // xdb() .........read whole db
      //console.log(2000,_xdb)
      return _xdb 
      //xOutput = _xdb
      //console.log(xOutput)
    } //ok
    

    
    

    //A D D -------------------------------------------------------
    // xdb({ collecName:{doc} })
    // can do multiple collec, multiple docs
    else if (typeof v=='object') { //new db, add
      //console.log(v)
      if ( Object.keys(v) == '' ) return null 

      for (collec in v) {
        //working here
        if (collec in _xdb) { //already existed
          
          if (Object.keys( v[collec] ) == '') return null 

          if (Array.isArray( v[collec] )) { //also set of docs

            v[collec].forEach( doc => {
              doc._id = xuuid()
              _xdb[collec].push(doc) //append
            })
          }//done

          else {
            /*
            //if only 1 doc to add
            v[collec]._id = xuuid()
            _xdb[collec].push(v[collec])
            */ 

            if (typeof v[collec] != 'object') {
              let docx = {
                data: v[collec],
                _id: xuuid()
              }
              _xdb[collec].push( docx )
              
            } else { //proper object
              v[collec]._id = xuuid()
              _xdb[collec].push(v[collec])
            }


          }//done 

        } else { //for new collec ...

          if (Object.keys( v[collec] ) == '') return null 

          if (Array.isArray( v[collec] )) { //for doc set

            v[collec].forEach( doc => { //put _id to all doc
              doc._id = xuuid()
            })

            _xdb[collec] = v[collec]  

          }//done 
          else {
            /*
            //for 1 doc add
            v[collec]._id = xuuid()
            _xdb[collec] = [ v[collec] ] 
            */ 

            if (typeof v[collec] != 'object' ) {
                let docx = {
                  data: v[collec],
                  _id: xuuid()
                }
                _xdb[collec] = [ docx ]

              } else {
                v[collec]._id = xuuid()
                _xdb[collec] = [ v[collec] ]
              }           
            

          }//done
        }
      }
      save(_xdb)

      /*
      //add each doc
      for (inputKey in v) {
        v[inputKey]._id = xuuid() 
        //console.log(v[inputKey])
        if (inputKey in _xdb) _xdb[inputKey].push(v[inputKey])
        else {
          //new collec
          _xdb[inputKey] = v[inputKey]
        }
      } 
      save(_xdb)
      */ 

    } //work for adding each doc, not many-doc yet




    //R E A D -----------------------------------------------
    else if (typeof _xdb=='object' && typeof v=='string') { 

      let adminCommand = v.match( /^(_\w+) ?(\w+)?/ )

      if ( adminCommand != null ) {
        //this is admin command
        //alert(adminCommand[0])
        admin(adminCommand[0])

      } else {
        //move all below here
          // xdb('user.name:john') .......done
        // xdb('item.stock:>100') ............done

        //test multi-command
        // xdb('(user.name:jo).status=good')
        let multi = v.match(  /\((.+)\)(.(.+))?/  )

        if (multi != null) { // working here........done
          //multi-command
          //console.log(multi)
          let collec = ''

          if ( multi[1].includes('.') ) {
            collec = multi[1].match(/(\w+)\./)[1]
          } else {
            collec = multi[1] // like: xdb('(goods).????')
          }

          let firstCommandResult = readExec(multi[1])
          //console.log(firstCommandResult)

          //alert('--')

          //will serve series of change here, like: xdb('(...).---;---')
          //console.log(multi[3])
          if (
            multi[3].includes(';') && 
            multi[3].match(/^_/) == null //don't have _ sign
            ) 
          {
            let eachChange = multi[3].split(';')
            trimAr(eachChange)

            if (!eachChange[0].includes('=')) {
              //this is select cmd not change
              return selectExec( multi[3].trim() )
            } else {
              //this is change cmd
              eachChange.forEach( command => {
                changeExec(command)
              })
            }
            
          } else {
            //more command like '(...)._copyTo xyz' do here
            if ( multi[3].match(/^_/) ) {
              //alert('this is more command to work on')
              moreCommand(multi[3])
            } else {
              //this is change for 1 command
              if ( multi[3].includes('=') ) {
                changeExec( multi[3].trim() )
              } else {
                //this is select cmd, 1 cmd
                return selectExec( multi[3].trim() )
              }
            }         
          }


          //execute each change command
          function changeExec(eachChange) {
            //change command
            let change = eachChange.split('=') //! what if no = ?
            let key = change[0].trim()
            let val = change[1].trim()

            for (resulDoc of firstCommandResult) {
              _xdb[collec].forEach(doc => {
                if (doc._id == resulDoc._id) {
                  doc[key] = val //for case = , need for other cases too
                }
              })
            }        
          }


          function selectExec(s) { //working here............
            // xdb('(country).name;interTelCode')
            // select some data and return
            // a is array
            //console.log(s)
            let eachSelec = s.split(';')
            if (eachSelec.length == 1) {
              //simple array to output because only 1 key selected
              //alert(100)
              //console.log(firstCommandResult)
              let selOutput = []
              for (doc of firstCommandResult) {
                selOutput.push( doc[eachSelec] ) //eachSelec is key
              }
              //console.log(selOutput)
              return selOutput
              //done

            } else {
              //array of object to output
              let selOutput = []
              for (doc of firstCommandResult) {
                let obj = {}
                eachSelec.forEach(key => obj[key] = doc[key])
                selOutput.push(obj)
              }
              return selOutput
            }
          }
          


          function moreCommand(cmd) {
            if (cmd.match(/^_copyTo/)) { //working here.......
              //alert('_copyTo')
              let toCollec = cmd.match(/^_copyTo (\w+)/)[1]

              if (toCollec in _xdb) {}
              else _xdb[toCollec] = [] //if inexist, create new

              if (Array.isArray(firstCommandResult)) {
                firstCommandResult.forEach(doc => {
                  _xdb[toCollec].push(doc)
                })
              } else {
                _xdb[toCollec].push(firstCommandResult)
              }

              //copy done

            } 
            


            else if (cmd.match(/^_moveTo/)) {
              //alert('_moveTo')
              let toCollec = cmd.match(/^_moveTo (\w+)/)[1]            

              if (toCollec in _xdb) {

                if (Array.isArray(firstCommandResult)) {
                  for (i=0 ; i<firstCommandResult.length ; i++) {
                    let indexToMove = 
                      _xdb[collec].findIndex(
                        doc => doc._id == firstCommandResult[i]._id 
                    )
                    let moveThis = _xdb[collec].splice(indexToMove,1)[0]
                    _xdb[toCollec].push(moveThis)
                  }
                }
              } else {
                //if the target collec inexisted, not do anything
              }

              //move done

            } 
            
            else if (cmd.match(/^_rename/)) { //working here......
              //rename collec, keys
              // xdb('(goods)._rename > product')
              // xdb('(user.name:john)._rename note > remark; x>y ; ... ')
              //alert(cmd)

              if (cmd.includes(';')) {
                //this is many rename
                //let multiRename = cmd.match(/_rename (.+)/)
                //alert(cmd)

                let multiRenameAll = cmd.match(/_rename (.+)/)
                let eachRename = multiRenameAll[1].split(';') 
                trimAr(eachRename)
                //console.log(eachRename)

                firstCommandResult.forEach(inputDoc => {
                  _xdb[collec].forEach(docToRename => {
                    if (inputDoc._id == docToRename._id) {
                      eachRename.forEach(command => {
                        let cmdDigest = command.match(/(\w+) ?> ?(\w+)/)
                        let currentName = cmdDigest[1]
                        let newName = cmdDigest[2]

                        if (  currentName != '_id' && 
                              currentName in docToRename && 
                              !(newName in docToRename) 
                            ) 
                        {
                          //good to go
                          docToRename[newName] = docToRename[currentName]
                          delete docToRename[currentName]
                        } else {
                          //bad
                          console.log('bad command, no action')
                        }
                        
                      })
                    }
                  })
                })//done

                //what about multi-rename for many doc or whole collec?
                //from testing = work, but will need to check keys before rename that it exists or not, and not do on _id

              } else {
                //this is 1 rename
                let cmdDigest = cmd.match(/_rename (\w+)? ?> ?(\w+)/)
                //console.log(cmdDigest)
                let currentName = cmdDigest[1]
                let newName = cmdDigest[2]

                if (multi[1] == collec && 
                    currentName == undefined) {
                  //rename collec
                  _xdb[newName] = _xdb[collec]
                  delete _xdb[collec]
                  //done

                } else {
                  //rename doc for 1 key
                  //console.log(firstCommandvalidated)
                  firstCommandResult.forEach(doc => {
                    _xdb[collec].forEach( dbDoc => {
                      if (dbDoc._id == doc._id ) {

                        if (  currentName != '_id' && 
                              currentName in dbDoc && 
                              !(newName in dbDoc) 
                            ) 
                        {
                          //good
                          dbDoc[newName] = dbDoc[currentName]
                          delete dbDoc[currentName]
                        } else {
                          //bad
                          console.log('bad command, no action')
                        }
                        
                      }     
                    })
                  })
                  //done, rename 1 key of all docs from (...)
                }
              }
            }//end rename 
            
            
            else if (cmd.match(/^_delete/)) {
              //alert('_delete')
              //delete doc 

              if (multi[1] == collec) {
                //this is deleting the collec
                delete _xdb[collec]
              } else {
                //this is deleting the docs

                for (i=0 ; i<firstCommandResult.length ; i++) {
                  let indexToDelete = 
                    _xdb[collec].findIndex(
                      doc => doc._id == firstCommandResult[i]._id 
                    )
                  _xdb[collec].splice(indexToDelete,1)
                }

              }

              

              //delete done , both docs & collec
            }


          }//end moreCommand()


          save(_xdb)
          //working


        } else {
          //not multi-command
          //console.log(v)
          //let outputt = readExec(v)
          
          let outputx = readExec(v) 
          if ( Array.isArray(outputx) ) {
            if (outputx.length == 1) return outputx[0]
            else return outputx
          } else {
            return outputx 
          }

        }


      }
      

      //this block handles user.name:john >>should put in a func
      // w = user.name:jo
      function readExec(w) {

        if (w.includes('.')) {

          let commandPart = w.split('.')
          trimAr(commandPart)
          let collec = commandPart[0]
          let key, value  

          if (commandPart[1].includes(':')) {
            [key,value] = commandPart[1].split(':')
          } else {
            return null //like xdb('user.name') not specify anything more
          }    
          
          //workon :> , < , !=
          //console.log(value)
          let valDigest = value.match(/(<|>|!=)(.+)/) 
          let sign, val 
          if (valDigest != null) {
            sign = valDigest[1] //like <,>,!=
            val = valDigest[2] //like 'john'

            //alert(valSign + ',' + valCommand)
            let outputt = eval(`
              _xdb[collec].filter(
                doc => doc[key] ${sign} '${val}'
              )
            `)
            return outputt 
          
          } else {
            //working
            //alert(collec +','+ key +','+ value)
            //this part for non-speical-sign in the value (no <,>,!=)
            let _val = new RegExp(value,'i')
            let outputt = _xdb[collec].filter(
                doc => doc[key].toString().match(_val)
                //^ works for 'user.name:j'
                //but not work for 'item.category:food'
                //SOLVED: problem is the use of word 'item' as collec is causing the problem. May be some conflicts with js engine. 
                //no!, problem is actually the word 'category'
              )

            if (outputt == '') return null 
            else return outputt 
          }

        } else {
          //this case no key specified, only collec supplied
          return _xdb[ w.trim() ]
        }
      }//end of readExec()
      
      
      function admin(v) { //working here............
        //runs all admin commands
        
        if (v == '_export') {
          //export _xdb to xdb.json and can save or store in any place
          download(toJson(_xdb),'xdb','json')
          //done
        }

        else if (v == '_status') {
          //show status message of xdb

          function grossDocQty() {
            grossQty = 0
            for (collec in _xdb) {
              grossQty = grossQty + collec.length 
            }
            return grossQty
          }

          console.log( 
            { software: 'xdb',
              version: '0.1',
              developer: 'mutita.org',
              collectionQty: Object.keys(_xdb).length ,
              docQty: grossDocQty(),
              totalCharacterSize: toJson(_xdb).length
            }
          )
          //done
        }

        else if (v == '_collec') {
          //show all collec in xdb
          console.log( Object.keys(_xdb) )
        }



      }

    }//#read //now basic read works: string, number values
/////////////////////////////////////////////////////////////////
  } // end of run()    
}//end of the $ block ---------------------------------------


// HELPER FUNC
function trimAr(array) {
  for (i=0 ; i < array.length ; i++) {
    array[i] = array[i].trim()
  }
}

function toJson(ob) {
  return JSON.stringify(ob)
}

function fromJson(json) { //convert json > x
  return JSON.parse(json)
}

function save(x) {
  //localStorage.setItem('_xdb', toJson(o) )
  xfile.write(xdbFile, toJson(x))
}

async function read() {
  //return fromJson( localStorage.getItem('_xdb') )
  return await fromJson( xfile.read(xdbFile) )
}

function generalRead(localName) {
  return fromJson( localStorage.getItem(localName) )
  /*  put the name of localStorage var which already stored as json and then the func will convert into obj.
  */ 
}

function xuuid() { //gen univeral unique id 
  let id1 = Date.now()
  let id2 = Date.now()
  while (id1==id2) {
    id2 = Date.now()
  }
  return id2 
}


function checkid() {
  let _xdb = read()
  for (col in _xdb) {
    if ( Array.isArray(_xdb[col]) ) {
      for (doc of _xdb[col]) {
        if ('_id' in doc) {}
        else doc._id = xuuid()
      }
    }
  }
  save(_xdb)
}//ok

function deleteDb() {
  _xdb = null 
  //localStorage.removeItem('_xdb')
  xfile.erase(xdbFile)
}


//2023-2-21 M/all ok, 
//2023-2-22 M/the optional chaining is not supported in node.12 so cut it first

//2023-2-24 M/now solved not returning data by putting the : ...return new Promise .... solved.

