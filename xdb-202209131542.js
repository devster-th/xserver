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

    {delete:{name:"john"}, in:"people", db:"simpleDb"}
  
*/


//INITIALIZATION
const   fileSys     = require("fs")
const   _int        = Symbol("_int internal use")
let     xdb         = {}                   
const   xdbFile     = "xdb.json"

readDbFile()

/* try to add symbol property, still not work
xdb[_int] = {note:"this is internal prop"}
console.log(xdb) */

// TEST COMMAND HERE
setTimeout( ()=> {
    //xdb_({find:{qty:"> 100"},in:"goods"})
    //xdb_({add:{name:"meat ball",price:65,qty:100},in:"goods"})
/*
    xdb_({  create:{db:"simpleDb"},
            collec:"people goods order contract"     })

    xdb_({  add:{ people:[
                            {name:"john", age:22, sex:"male", birthday:"3/11"},
                            {name:"jane", age:18, sex:"female", birthday:"16/4"}
                        ]},
            db:"simpleDb"   })

    xdb_({ add:{people:{name:"dad",age:54,sex:"male"}}, db:"simpleDb" })
    xdb_({ add:{people:{name:"mom",age:53,sex:"female"}}, db:"simpleDb" })

    xdb_({  add:{goods: [
            {goods:"noodle", price:100, qty:1000, status:"available"},
            {goods:"steak", price:152, qty:500, status:"available"},
            {goods:"coffee", price:80, qty:10000, status:"available"},
            {goods:"nuclear", price:500000, qty:452, status:"suspending"},
        ]},
        db:"simpleDb"   })

    xdb_({  add:{order:[
            {orderNum:100, date:"2022", goods:"noodle", price:5000},
            {orderNum:456, date:"2021", goods:"coffee", price:465687545},
            {orderNum:98562, date:"2021", goods:"steak", price:45621354},
            {orderNum:845612, date:"2022", goods:"neclear", price:87454896451},
        ]},
        db:"simpleDb"  })
*/
    console.log("//xdb - updated data")
    console.log(xdb)

},1000)


//PROGRAM
function xdb_(x) {


    //create
    /*    {create:{ db:"aaa", collec:"bbb ccc ddd ..." }
    */
    if ("create" in x) {
        if ("db" in x.create) {     //create both db & collec
            xdb[x.create.db] = {}   //create db
            //console.log(xdb)

            if ("collec" in x) {
                //console.log("there's collec command")
                let colList = x.collec.split(" ")
                //console.log(colList)
                for (colName of colList) {
                    xdb[x.create.db][colName] = {}
                    //console.log()
                }
            }
        }
    saveDbFile()    
    console.log("CREATE OUTPUT")
    console.log(xdb)
    }

    //add
    /* 
        {add:{ people:[
                        {name:"john", age:22, sex:"male"}, 
                        {...}
                    ],
        db:"simpleDb" }}
    */

    if ("add" in x) {
        console.log(x.add)
        let collecName = Object.keys(x.add)[0] //people
        //if input has multiple dataSet
        if ( Array.isArray(x.add[collecName]) ) {
            let qtyDataset = x.add[collecName].length 
            let dataSetid = xuid_(qtyDataset)
            //the id may not represent the moment the set creates but
            //should still be reasonable.

            for (i=0; i < qtyDataset; i++) {
                xdb[x.db][collecName][ dataSetid[i] ] = x.add[collecName][i]
            }  
        } else { //if not array so it's 1 dataSet, just put it
            let dataSetid = xuid_(1)
            while (dataSetid in xdb[x.db][collecName]) { //if dup, regen code
                dataSetid = xuid_(1)
            }
            xdb[x.db][collecName][ dataSetid[0]] = x.add[collecName]
        }
        saveDbFile()
        console.log("ADD OUTPUT")
        console.log(xdb[x.db])
    }



    //find
    if ("find" in x) {

        console.log("FIND OUTPUT")
        console.log(x)

        //check the input having '>' or not
        let what = Object.keys(x.find)[0]  
        if ( /^>/.test( x.find[what] )  ) {

            //if true do comparison mode: > , <
            let split = x.find[what].split(" ")
            split[1] = Number(split[1]) //convert to number
            x.find[what] = split //put back
            
            //loop
            console.log(x.in)

            for (key in xdb[x.in]) {
                //in real case must work with all compare signs
                //not only >
                if (xdb[x.in][key][what] > x.find[what][1]) {
                    console.log(xdb[x.in][key])
                }
            }
            
            //work

        } else {

            //do other mode

            let _regEx = new RegExp(x.find[what])
    
            //start to produce output
            console.log(x.in)

            for (key in xdb[x.in]) { //rec has only keys
                if (_regEx.test(xdb[x.in][key][what]) ) {
                    console.log(xdb[x.in][key])
                }
            }


        }

       


    //use rexEx to give more flex to the search term
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
//saveDbFile() 




/*NOTE
generally working for create & add, not find yet
the 'add' if different collec still dup the setid because it check only
the current 'collec'
--to fix may be we need a set to keep all the setid, or we may allow for dup
in diff collec???


*/