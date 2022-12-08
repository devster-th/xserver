// dx.js
/*  changed name from xdb.js 
    a program that tries to make the data handling more simple. */

// init ///////////////////////////////////////////////////////




// program ////////////////////////////////////////////////////////
exports.b = function (x={}) {

    const fileSys = require("fs")
    //let     xdb = {} //internal use
    const xdbFile = "xdb.json"
    
    //readDbFile
    fileSys.readFile(xdbFile,"utf8",(error,data)=>{

        if (data !="") {
            global.xdb = JSON.parse(data)
        } else {
            global.xdb ={ _int:{
                                 idList:[],
                                 collecList: [],
                                 findOutput: [],
                                 lastRunTime: new Date(),
                                 log: [],
                                 version: "0.5"
                                }
            } //the file is blank
        }

        //log_(xdb)
        //return data_ 
        //log_("////////////////////////////////////////////////////")
        //console.log(`//xdb - loaded xdb.json .........${new Date()}`)
    

        //keep log
        //xdb._int.log = []
        //xdb._int.log.push({time: new Date(), input:JSON.stringify(x) })


        //test ..... {test:"xdb"}
        if ("test" in x) {
            if (x.test =="xdb") console.log("yo!, this is xdb") 
        }



    //create----------------------------------------------------------------
        if ("create" in x) {
            log_("//create input------------------------------------------")
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


    //add----------------------------------------------------------------
        if ("add" in x) {
            log_("//add input---------------------------------------------------")
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



    //find command-----------------------------------------------------
        //! find multiple keys still not work.....fix it
        //      * the following key must be searched only in the previous key's result
        //      { find: { name: 'john', age: 22 }, in: 'people' }
        if ("find" in x) {
            log_("//find input----------------------------------------------------")
            log_(x)
            let output = {}
            let keyList = Object.keys(x.find) //name,age
            log_(keyList)
            
            log_("//find output---------------------------------------------------")
            //first key first
            for (i=0; i < keyList.length; i++) { //keyList block

                //let source = xdb[x.in]
                let key = keyList[i]
                let value = x.find[keyList[i] ]
                let embedCompare =false     //default
                output[i] = [] //output[0] = [{},{},...]
                log_(`key=${key}, value=${value}`)
            

                //check to change dataSource
                //if (i>0) { source = output[i-1] }

    //VERY FIRST THING
                //.... "*" ...star search
                //the * should have only... find:"*" ... or not? , no multi-key
                // ... { find:"*", in:"people" }
                if ( /^\*/.test(value) ) {
                    log_("this is star search")
                    embedCompare =true
                    for (doc in xdb[x.in]) {
                        log_(xdb[x.in][doc])
                        output[i].push(xdb[x.in][doc] )
                    }
                }//done            


    //COMPLEX SEARCH
                //...>, >=, <, <=
                if (/^[\>\<]\s?\d+$/.test(x.find[keyList[i] ]) 
                    || /^\>\=\s?\d+$/.test(value) 
                    || /^\<\=\s?\d+$/.test(value) ) {
                    log_("logic search")
                    embedCompare =true 
                    if (i==0) { //first-key
                        for (doc in xdb[x.in]) {
                            if (eval(xdb[x.in][doc][key] + value)  ) {//turns text to expression
                                //log_(xdb[x.in][doc])
                                output[i].push(xdb[x.in][doc])
                            }
                        }
                    } else { //further key
                        for (doc of output[i-1]) {
                            if (eval(doc[key] + value )  ) {
                                output[i].push(doc)
                            }
                        }
                    }
                    
                }//done


                //... !, =  
                if ( /^\!\s?\w+$/.test(value) || /^=\s?\w$/.test(value) ) {
                    log_("! search")
                    embedCompare =true 
                    let sign = value.match(/^./)
                    //log_(sign == "!")
                    let realValue = value.match(/\w/g).join("")
                    //log_(realValue)
                    if (sign=="!" && i==0) {
                        for (doc in xdb[x.in]) {
                            if (xdb[x.in][doc][key] != realValue) {
                                log_(xdb[x.in][doc])
                                output[i].push(xdb[x.in][doc])
                            }
                        }
                    }
                    if (sign=="!" && i>0) {
                        for (doc of output[i-1]) {
                            if (doc[key] != realValue) {
                                log_(doc)
                                output[i].push(doc)
                            }
                        }
                    }//done

                    //continue for "=" here
                    // = means 'exactly matched' , case sensitive
                    if ("=") {

                    }
                }

                //... find:{country:"canada / africa"}
                //this case should no partial-search, user has to put exact words 
                //between the /
                if (/ \/ /.test(value) ) {
                    log_("/ search")
                    embedCompare =true 
                    let subValue = value.toLowerCase().split(" / ") //future check if need trim()?
                    log_(subValue) // always is 2 items array
                    let leftCompare ="", rightCompare =""
                    if (i==0) {
                        for (doc in xdb[x.in]) {
                            if (subValue[0] == xdb[x.in][doc][key].toLowerCase() ) { //canada
                                leftCompare = true 
                            } else {
                                leftCompare = false
                            }
                            if (subValue[1] == xdb[x.in][doc][key].toLowerCase() ) { //africa
                                rightCompare = true 
                            } else {
                                rightCompare = false 
                            }
                            if (leftCompare || rightCompare) { // if left / right
                                log_(xdb[x.in][doc])
                                output[i].push(xdb[x.in][doc])
                            }
                        }
                    } else {
                        for (doc of output[i-1]) {
                            if (subValue[0] == doc[key].toLowerCase() ) { //canada
                                leftCompare = true 
                            } else {
                                leftCompare = false
                            }
                            if (subValue[1] == doc[key].toLowerCase() ) { //africa
                                rightCompare = true 
                            } else {
                                rightCompare = false 
                            }
                            if (leftCompare || rightCompare) { // if left / right
                                log_(doc)
                                output[i].push(doc)
                            }
                        }
                    }
                    
                    
                }//work, first simple code, still not regex, case insensitive, multi-key

            


    //GENERAL SEARCH            
                //...general search
                if (embedCompare ==false) {
                    //log_(key)
                    //log_(value)
                    let value_ = new RegExp(value,"i")
                    //log_(value_)
                    if (i==0) { //first key

                        for (doc in xdb[x.in]) { //search the collec for matching docs
                            //log_(doc)
                            //not embed-search
                            if (value_.test(xdb[x.in][doc][key] ) ) { //flex search
                                //log_(output)
                                output[i].push(xdb[x.in][doc] ) 
                                //log_(`'${keyList[i]}' matched`)
                                //log_(output )
                            } else {
                                //log_("key[0] not found")
                            }
                        }
                    } else { //further key
                        for (doc of output[i-1]) {
                            if (value_.test(doc[key] ) ) {
                                output[i].push(doc)
                            }
                        }
                    }
                    log_(output[i] )                
                }//done

                


            //log_(output[i] ) 
                
            } //keyList block

    //FINISHING        
            //check output before return
            if (output != "") {
                let length_ = Object.keys(output).length 
                log_("find final result----------------------------------------------")
                xdb._int.findOutput = output[length_ - 1]
                console.log(xdb._int.findOutput)
                return xdb._int.findOutput 
            } else {
                log_(`//find not found: ${JSON.stringify(x.find) }`)
                return "found"
            }

            
        
        }/*end find
    mostly basically done
    will work more on more complex like: age:"20-60", country:"thai / usa", group:"a & b"
    ! when put {find:{name:""}} ........xdb show all doc of the collec >> fix to 'not found'

        */


    //edit command------------------------------------------------------
        //working on calculatipon within the value = done
        //multiple edit = done
        //next work to edit multiple keys on each doc = works now

        if ("edit" in x) {
            log_("//edit input------------------------------------------------")
            log_(x.edit)
            //log_(xdb._int.findOutput)
            log_("//edit output------------------------------------------------")
            //log_(xdb._int.findOutput) //check
            for (doc of xdb._int.findOutput) { //loop the docs will edit
                for (key in x.edit) { //loop all keys of this doc
                    xdb[x.in][doc._id][key] = x.edit[key] //edit
                }
                xdb[x.in][doc._id].lastUpdated = new Date() //stamp time
                xdb[x.in][doc._id].note = JSON.stringify(x)  
                log_(xdb[x.in][doc._id]) //show edited doc
            }
            saveDbFile()
        }/*
        work for multi-key edit .....done
        make edit to be more simple as much as possible, no calculation or anything
        if we like to do some calc, should do outside the xdb

        */

        //delete command---------------------------------------------
        if ("delete in x") {

        }


        //show command--------------------------------------------------
        // { show:"status" }
        if ("show" in x) {
            if (x.show == "status") {
                log_("//show status-----------------------------------")
                log_(xdb._int)
            }

            if (x.show == "entireDb") {
                log_("//show entire db--------------------------------")
                log_(xdb)
            }
        }


        //this part is a wrap up of the xdb_
        if (x != {}) {
            xdb._int.lastRunTime = new Date() //stamp time before exit
            saveDbFile() //save every before-exit
        }

    }) //end of read file


    // microTask ////////////////////////////////////////////////////
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

    function charCode_(codeLength=1) {
        const charSet = 'abcdefghijklmnopqrstuvwxyz'
        let output = ''
        const charSetLeng = charSet.length
        for (i=0; i < codeLength; i++) {
            output += charSet.charAt(
                Math.floor(Math.random()*charSetLeng)
            )
        }
        return output 
    }


    //read dbx.json
    /*
    function readDbFile() {
        fileSys.readFile(xdbFile,"utf8",(error,data)=>{
            let data_ = JSON.parse(data)
            log_(data_)
            return data_ 
            //log_("////////////////////////////////////////////////////")
            //console.log(`//xdb - loaded xdb.json .........${new Date()}`)
        })
    }//test=passed
    */



    function saveDbFile() {
        fileSys.writeFile( xdbFile, JSON.stringify(xdb), 
            (error)=>{
                if (error) throw error 
            //console.log("//saved xdb.json")
        } )

        //save backup file to _xdb.json
        /*
        fileSys.writeFile("_xdb.json", JSON.stringify(xdb), 
            (error)=>{
                if (error) throw error 
            //console.log("//saved xdb.json")
        } )
        */

    }//test=passed

    //make a little bit shorter for the console.log() command
    function log_(input) {
        return console.log(input)
    }//test=passed




} //end exports.do()






/* tail note ////////////////////////////////////////////////////////
2022-09-14  now done create,add,find,edit in basic things

            *will make xuid really unique in the db, put in the
            _int.xuidList

            she is now studying in Pitsnuloakshe is now studying in Pitsnuloak

2022-09-16  **change data structure to be: db.collec.doc.item, 
            rewrite the whole new codes
            
2022-09-17  create, add, find works with =,>,< and /=/            
            now the edit works, can handle calc in the input value

2022-09-19  create, add, edit, find ...works, find multi-key also work
            now working on embed-search        
            
2022-09-20  create,add,find,edit .......works with multi-key
            'find' support multi-key =done
            'edit' after multi-key-search is done, we select only the last output
            and keep in xdb._int.findOutput which is [] 

2022-09-23  the /-search done
            will need to make all comparison/search on 'lower case' , so will use xxx.toLowerCase() for all comparison. Done on the /-search but will need to 
            put more on other cases.


2022-09-24  may be put a little feature on the 'edit'
            e.g., --edit:{name:"_titleCase", country:"_upperCase", xxx:"_lowerCase", yyy:"_camelCase"}            
            --edit:{stock:"stock +1", date:"date + 30 day", price:"standardCost * 1.25"}

            if no in: specified, we may find in all collecs


            =>now work on ..find:{aaa:..., or_bbb:...}

2022-09-27  working to config into the simpleApp  
            =seems work, so make the read file the big one and put everything inside it


*/