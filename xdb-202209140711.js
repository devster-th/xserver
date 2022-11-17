//xdb.js
/* try to make a very simple json database
data model

    xdb ......this is database
      -dataCollection ...or collec
        -dataSet ...or set
          -dataitem ...or item
            -key:value

    so we can refer to data as:
      xdb.dbName.collecName.setid.dataKey 
      xdb.simpleDb.people[1000].name


the command pattern is follow:

    {create:{db:"simpleDb", collec:"people goods order"}}
    
    {add:[{nam:"john",age:22},{name:"jane",age:18}], in:"people", db:"simpleDb"}

    {edit:{name:"john"}, tobe:{grade:4.0}, in:"people", db:"simpleDb"}
    
    {find:{name:".all"}, condition:{grade:"> 3.0"}, in:"people",db:"simpleDb"}


    {delete:{name:"john"}, in:"people", db:"simpleDb"}

  
*/


//INITIALIZATION
const   fileSys     = require("fs")
const   _int        = Symbol("_int internal use")
let     xdb         = { _int:{
                            idList:[],
                            collecList: []
                        } }                   
const   xdbFile     = "xdb.json"

readDbFile()
//saveDbFile()



// TEST COMMAND HERE
setTimeout( ()=> {
   
   /*
    xdb_({create:{collection:"people goods order"}})   
    
    xdb_({add:[
            {name:"dad", age:54, sex:"male"}, 
            {name:"mom", age:53, sex:"female"}, 
            {name:"john", age:22, sex:"male"}, 
            {name:"jane", age:18, sex:"female"}, 
            ],
        in:"people" })

    xdb_({add:[
        {name:"noodle", price:60, stock:1000}, 
        {name:"fried rice & star egg", price:80, stock:356}, 
        {name:"steak", price:152, stock:452}, 
        {name:"coffee", price:45, stock:456285}, 
        ],
    in:"goods" })

    xdb_({add:[
        {date:"2022-9-1", goods:"fried rice", price:1000}, 
        {date:"2022-9-5", goods:"noodle", price:520}, 
        {date:"2022-6-14", goods:"steak", price:45621}, 
        {date:"2022-6-15", goods:"coffee", price:56254}, 
        ],
    in:"order" })



        console.log(xdb)
        xdb_({add:{note:"yoooooooooooooooo"}, in:"people"})
        xdb_({add:{note:"sadsdfsdfsdf"}, in:"goods"})
        xdb_({add:{aaaa:300000}, in:"goods"})

        xdb_({add:[{note:"55555"},{something:"yoooooooooo"}
                    ], in:"order"})

    */
    log_("//updated data")
    console.log(xdb)

    xdb_({ find:{name:"cof"}, in:"goods"}) //find:"*" ....should ok too

},1000)


//PROGRAM
function xdb_(x) {


    //create
    /*    {create:{ collection:"people goods order" }
    */
    if ("create" in x) {
        if ("collection" in x.create) {
            if (/ /.test(x.create.collection)) {    //multiple collec
                let split = x.create.collection.split(" ")
                for (item of split) {
                    xdb[item] = {}
                }

            } else {    //only 1 collec
                xdb[x.create.collection] = {}
            }
        }
        console.log(xdb)
        saveDbFile()
    }

    //add
    /* 
        {add:[
                {name:"john", age:22, sex:"male"}, 
                {...}, ...
            ],
        in:"people" }} //collecName
    */

    if ("add" in x) {
        if (Array.isArray(x.add)) { //array = multiple dataSet
            let qty = x.add.length
            let xuid = xuid_(qty)
            for (i=0; i < x.add.length; i++) {
                xdb[x.in][xuid[i]] = x.add[i]
            }
        } else {    //only 1 set
            let xuid = xuid_(1)
            xdb[x.in][xuid] = x.add 
        }        
        console.log(xdb)
        saveDbFile()
    }



    //find
    /*  {   find:{name:"john"}, //now can put just ...j or jo
            in:"people"             }
    */
    if ("find" in x) {
        log_("//find output")
        log_(x.in)
        let aa = [] //list of itemkey to find
        let i=0
        for (itemKey in x.find) {
            aa[i] = itemKey     //what key to find: name, age, sex,...
            i++
        }
        //now assume we know only 1 item in the find
        let keyToFind = aa[0]   //age        
        let findWord = x.find[keyToFind]    // "> 18"

        //check findWord if there's a compareInside?
        let compareInside = ""
        if (/^[<!>] /.test(findWord) ) { //so get into 'compare mode'
            let compareInside = findWord.split(" ")
            let comSign = compareInside[0]
            let comValue = compareInside[1]
            if (comValue.match(/\d/g) ) {
                comValue = Number(comValue)
            }
            
            for (datasetKey in xdb[x.in]) {
                if (comSign==">") {
                    if (xdb[x.in][datasetKey][keyToFind] > comValue) {
                        log_(xdb[x.in][datasetKey])
                    }
                }
                if (comSign=="<") {
                    if (xdb[x.in][datasetKey][keyToFind] < comValue) {
                        log_(xdb[x.in][datasetKey])
                    }
                }
                if (comSign=="!") {
                    if (xdb[x.in][datasetKey][keyToFind] != comValue) {
                        log_(xdb[x.in][datasetKey])
                    }
                }
                

            }
            
            
        
        } else {

            //not compare mode
            //log_(findWord)
            if (findWord =="*") { //just rollover don't need to do anything
                for (datasetKey in xdb[x.in]) {
                    log_(xdb[x.in][datasetKey])
                }

            } else {
                let regExp = new RegExp(findWord,"i") // ... /> 18/i
                for (datasetKey in xdb[x.in]) {
                    //console.log(xdb[x.in][datasetKey][keyToFind])
                    if ( regExp.test(xdb[x.in][datasetKey][keyToFind]) ) {
                        console.log(xdb[x.in][datasetKey])
                    }
                }        
            }
        }


        

    //simple find = passed     
    //now find with regex works for simple one   
    //just output to console first, will work on else later
    // compare mode (<,>) now work
    }

    
}


// microTask
// let code = genShortCode(3)

function xuid_(qty) {
    let xuid = [], newCode=0
    for (i=0; i<qty; i++) {
        newCode = Date.now()
        while (newCode == xuid[i-1]) { //loop until get new timestamp
            newCode = Date.now()
        }
        xuid[i] = newCode //the code is simple timestamp with a prefix
    }
    return xuid 
    //console.log(`OUTPUT OF ${qty} XUID`)
    //console.log(xuid)

}

function genShortCode(length) {
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
}




function saveDbFile() {
    fileSys.writeFile( xdbFile, JSON.stringify(xdb), 
        (error)=>{
            if (error) throw error 
        //console.log("//saved xdb.json")
    } )
}


function log_(input) {
    return console.log(input)
}


/*NOTE
changed command pattern back to few days, to make it more simple and natural

now create & add work
the id should make it unique across the db, will get back to solve

decided to make an _int property to keep internal data of the xdb, not using symbol because the symbol prop will be lost when saving to file.

now find in <,=,>,!,* and search part of text ....work


*/