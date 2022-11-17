//xdb.js
/* try to make a very simple json database
data model
now v0.5 ....adjust the language

-----------------------------------------------

    db .......xdb
    -collection ...people, goods, order
      -doc ...john
        -item ...name, age, sex

    xdb.people.john ... this will show all john's data
    xdb.people.john.age ...shows john's age
    
    so not:
    xdb.people[10000000000].name ----not like this any more


* the data structure will look like this:




the command pattern is follow:

CREATE
    {   create: "people goods order"    } //don't need to say 'collection'

ADD
*the add may support not multi-dataSet but multi-collec too
    ^may not a good idea, makes it more complex

    {   add:[
                {nam:"john",age:22},
                {name:"jane",age:18}    
            ], 
        in:"people"                         }

    * shouldn't add multi-collec in a command, too complex
    



EDIT
so do find first then edit or delete

    {   find:{name:"john"},
        edit: {note:"this is good guy"}, 
        in: "people"            }
    
FIND    
    {   find:{name:"john"}, in:"people", 
                output:"return/console/varName"     }

    {   find:{name:"jo"},   in:"people" ...     } // 1 simple condition
    {   find:{age:"> 20"},  in:"people" ...    } // 1 condition with compare
    {   find:{price:"< 100"}, in:"goods" ...    }
    {   find:{name:"! john"}, in:"people" ...   } //find not john
    {   find:{name:"*"}, in:"people" ...        } //find all name
    {   find:"*", in:"people"   }

multi-condition
    {   find:{group:"AA", grade:"> 60"}, in:"people" } // AND
    {   find:{team:"AA", or_team:"BB", age:"< 35"} } // OR then &



DELETE
    {   find:{name:"john"}, delete:"*", in:"people"   } ..delete whole set of john data

  
*/


//INITIALIZATION
const   fileSys     = require("fs")
let     xdb         = { _int:{
                            idList:[],
                            collecList: []
                        }} //internal use

const   xdbFile     = "xdb.json"

readDbFile()
//saveDbFile()



// TEST COMMAND HERE
setTimeout( ()=> {
   
/*    
    xdb_({  create: "people goods order"    }) 

    xdb_({  add:[
                    {name:"dad", age:54, sex:"male"},
                    {name:"mom", age:53, sex:"female"},
                    {name:"john", age:22, sex:"male"},
                    {name:"jane", age:18, sex:"female"},
                    {name:"biden", age:54, sex:"male"},
                    {name:"putin", age:53, sex:"female"},
                    {name:"trudo", age:22, sex:"male"},
                    {name:"jamica", age:18, sex:"female"}

                ], // {name:"dad", age:54, sex:"male"},
            in:"people" 
        })
    
    xdb_({  add:[
                    {name:"noodle",price:525, stock:5265},
                    {name:"coffee",price:5454, stock:8451},
                    {name:"rice",price:452, stock:256},
                    {name:"phone",price:4548, stock:62145},
                    {name:"table",price:547, stock:1258}
                ],
            in:"goods"
        })

    xdb_({  add:[
                    {num:"s100",goods:"noodle",price:5000, date:"2022-09-01"},
                    {num:"s200",goods:"steak",price:10000, date:"2022-09-02"},
                    {num:"s526",goods:"coffee",price:300000, date:"2022-09-05"},
                    {num:"s562",goods:"phone",price:1000000, date:"2022-09-15"},
                    {num:"s600",goods:"table",price:30000, date:"2022-09-20"}
                ],
            in:"order"
        })

*/   

    //now work on the find command
    xdb_({   find:{name:"d"}, in:"people"  })

    //log_(xdb)

},1000)


//PROGRAM
function xdb_(x) {

    //create---------------------------------
    if ("create" in x) {
        log_(x)
        let collecList = [x.create]
        if (/ /.test(collecList)) { //if multi coll?
            collecList = x.create.split(" ")
            //log_(collecList)
        }       

        //now crete the collec
        for (collName of collecList) {
            xdb[collName] = {}
        }

        //keep the collec name in _int
        for (name_ of collecList) {
            xdb._int.collecList.push(name_)
        }//this part not test yet

        saveDbFile()
        log_(xdb)

    } //test=passed


    //add-------------------------------------------
    if ("add" in x) {
        log_(x)
        let docToAdd = ""
        if (Array.isArray(x.add)) {
            docToAdd = x.add 
        } else {
            docToAdd = [x.add]
        }

        
        for (doc of docToAdd) {
            doc._id = xuid_()
            xdb[x.in][doc._id] = doc 
        }
        saveDbFile()
        log_(xdb[x.in])


        //xdb[x.in][x.add[Object.keys(x.add)[0] ]] = x.add 
        //so take first key as the dataSet key

    }//test=passed



    //find command-----------------------------
    if ("find" in x) {
        log_(x)
        let output = []
        let keyToFind = Object.keys(x.find) //name
        //log_(keyToFind)
        let valueToFind =  x.find[ Object.keys(x.find) ] //john
        //log_( valueToFind   )

        //if value="*"
        if (valueToFind == "*") { //take the whole collec
            for (doc in xdb[x.in] ) {
                output.push(xdb[x.in][doc])
            }
        } else { //not * search

            // > inside the value
            //log_(/ /.test(valueToFind) )
            let splitValue = valueToFind.split(" ")
            //log_(splitValue)
            if (splitValue[0] == ">") {
                for (docid in xdb[x.in]) {
                    if (xdb[x.in][docid][keyToFind] > splitValue[1] ) {
                        output.push(xdb[x.in][docid])
                    }
                }
            } else {

                if (splitValue[0] == "<") {
                    for (docid in xdb[x.in]) {
                        if (xdb[x.in][docid][keyToFind] < splitValue[1] ) {
                            output.push(xdb[x.in][docid])
                        }
                    }   
                } else {
                    //put regex func for partial find or flex find
                    let _rex = new RegExp(valueToFind,"i")

                    //compare
                    let i=0
                    for (docid in xdb[x.in]) {
                        if (_rex.test(xdb[x.in][docid][keyToFind]) ) {
                            output[i] = xdb[x.in][docid]
                            i++
                        } 
                    }
                }






                
            }

            
        }


        

        //check output before return
        if (output != "") {
            log_(output)
        } else {
            log_(`//not found: ${JSON.stringify(x.find) }`)
        }

        
       
    }/*
    basic find is work, cover = comparison
    rex = work
    star search = done
    >, < = done
    */







} //end xdb_(x)


// microTask
// let code = genShortCode(3)

function xuid_() {
    let xuid = Date.now()
    while (xdb._int.idList.includes(xuid)) {
        xuid = Date.now()
    }
    xdb._int.idList.push(xuid)
    return xuid 
    //console.log(`OUTPUT OF ${qty} XUID`)
    //console.log(xuid)
}//test=passed

function charCode_(length) {
    const charSet = 'abcdefghijklmnopqrstuvwxyz'
    let output = ''
    const charSetLeng = charSet.length
    for (i=0; i < length; i++) {
        output += charSet.charAt(
            Math.floor(Math.random()*charSetLeng)
        )
    }
    return output 
}


//read dbx.json
function readDbFile() {
    fileSys.readFile(xdbFile,"utf8",(error,data)=>{
        xdb = JSON.parse(data)
        console.log("//xdb - loaded dbx.json")
        //console.log(xdb)
    })
}//test=passed




function saveDbFile() {
    fileSys.writeFile( xdbFile, JSON.stringify(xdb), 
        (error)=>{
            if (error) throw error 
        //console.log("//saved xdb.json")
    } )
}//test=passed


function log_(input) {
    return console.log(input)
}//test=passed

//count how many dataitem in an object 
//* use Object.keys() instead
function getKeyList(obj) {
    let list = [], count=0
    for (k in obj) {
        list[count] = k 
        count++
    }
    return list  
}

/*NOTE
2022-09-14  now done create,add,find,edit in basic things

            *will make xuid really unique in the db, put in the
            _int.xuidList

            she is now studying in Pitsnuloakshe is now studying in Pitsnuloak

2022-09-16  **change data structure to be: db.collec.doc.item, 
            rewrite the whole new codes
            
2022-09-17  create, add, find works with =,>,< and /=/            

*/