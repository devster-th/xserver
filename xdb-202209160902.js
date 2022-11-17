//xdb.js
/* try to make a very simple json database
data model

    xdb ......this is database
      -dataCollection ...or collec
        -dataSet ...or set
          -dataitem ...or item
            -key:value

    so we can refer to data as:
      xdb.dataCollection.dataSetid.dataKey ... will get the value 
      xdb.people[1000].name


the command pattern is follow:

CREATE
    {   create:{ collection:"people goods order"}   }

ADD
*the add may support not multi-dataSet but multi-collec too
    ^may not a good idea, makes it more complex

    {   add:[
                {nam:"john",age:22},
                {name:"jane",age:18}    
            ], 
        in:"people"                         }

EDIT
    {   edit: {name:"john"}, 
        changeto: {grade:4.0}, 
        in: "people"            }
    
FIND    
    {   find:{name:"john"}, in:"people", 
                output:"return/console/varName"     }

    {   find:{name:"jo"},   in:"people" ...     }
    {   find:{age:"> 20"},  in:"people" ...    }
    {   find:{price:"< 100"}, in:"goods" ...    }
    {   find:{name:"! john"}, in:"people" ...   } //find not john
    {   find:{name:"*"}, in:"people" ...        } //find everything

    *work more on {..} & {..} --and-- {..} / {..}


DELETE
    {   delete:{name:"john"}, in:"people"   }

  
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

    //xdb_({ find:{name:"cof"}, in:"goods"}) //find:"*" ....should ok too
    /*xdb_({  edit:{name:"jane"}, in:"people", 
            changeto:{grade:352, note:"learning business in Gampaengsaen"} 
        })
    */
    xdb_({  edit: {name:"noodle"}, 
            in: "goods", 
            changeto: {productCode:"100000", minOrder:500}
        })
    
    log_(xdb.goods)

},1000)


//PROGRAM
function xdb_(x) {


    //create-----------------------------------------------------
    /*    
        {create:{ collection:"people goods order" }
    
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
    } //end create



    //add----------------------------------------------------------
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
    } //end add



    //find----------------------------------------------------
    /*  {   find:{name:"john"}, //now can put just ...j or jo
            in:"people"             }
    */
    if ("find" in x) {
        let findOutput = {key:"",value:""} //output both k:v
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
                        findOutput.key      = datasetKey
                        findOutput.value    = xdb[x.in][datasetKey]
                        //log_(xdb[x.in][datasetKey])
                        //return findOutput
                    }
                }
                if (comSign=="<") {
                    if (xdb[x.in][datasetKey][keyToFind] < comValue) {
                        findOutput.key      = datasetKey
                        findOutput.value    = xdb[x.in][datasetKey]
                        //log_(xdb[x.in][datasetKey])
                        //return findOutput
                    }
                }
                if (comSign=="!") {
                    if (xdb[x.in][datasetKey][keyToFind] != comValue) {
                        findOutput.key      = datasetKey
                        findOutput.value    = xdb[x.in][datasetKey]
                        //log_(xdb[x.in][datasetKey])
                        //return findOutput
                    }
                }
                

            }
            
            
        //don't have the sign infront
        } else {

            //not compare mode
            //log_(findWord)
            if (findWord =="*") { //just rollover don't need to do anything
                for (datasetKey in xdb[x.in]) {
                    findOutput.key      = datasetKey
                    findOutput.value    = xdb[x.in][datasetKey]
                    //log_(xdb[x.in][datasetKey])
                    //return findOutput
                }

            } else {
                //find part or full of string
                let regExp = new RegExp(findWord,"i") // ... /> 18/i
                for (datasetKey in xdb[x.in]) {
                    //console.log(xdb[x.in][datasetKey][keyToFind])
                    if ( regExp.test(xdb[x.in][datasetKey][keyToFind]) ) {
                        findOutput.key      = datasetKey
                        findOutput.value    = xdb[x.in][datasetKey]
                        //console.log(xdb[x.in][datasetKey])
                        //return findOutput
                    }
                }        
            }
        }
        //give output
        if ("output" in x) { //specified output
            if (x.output =="console") log_(findOutput)
            if (x.output =="return") return findOutput
            //work more if output==a var 
        }


    } //end find
    //simple find = passed     
    //now find with regex works for simple one   
    //just output to console first, will work on else later
    // compare mode (<,>) now work




    //edit--------------------------------------------------
    /*  {   edit: {name:"john"}, 
            changeto: {grade:4.0, note:"this is good guy"}, 
            in: "people"            }
    
    */
    if ("edit" in x) {
        //log_("//edit output")
    /* this block work but will try to use the xdb_(find) instead
        //edit what?
        let dataKey = getKeyList(x.edit) // ["name"] ...!array
        //log_(x.edit[dataKey)  //!this is good that we don't have to put dataKey[0]

        //find dataSet that match
        let datasetToEdit = ""
        for (dataSetid in xdb[x.in]) { //loop people collec
            if (x.edit[dataKey] == xdb[x.in][dataSetid][dataKey] ) {
                datasetToEdit = dataSetid
                //log_(xdb[x.in][datasetToEdit])
            }
        }
    */

        //find the target dataSet 
        let datasetToChange = xdb_({ find:x.edit, in:x.in,          
                                            output:"return" })
        //log_("datasetToChange")
        //log_(datasetToChange)   // **no datasetKey here, add it /fixed

    
        //make change
        //find key to change
        let keyToChange = getKeyList(x.changeto) //grade,note

        //make change
        for (i=0; i< keyToChange.length; i++) {
            //log_(xdb[x.in][datasetToChange.key]) //xdb.people[id]

            xdb[x.in][datasetToChange.key][keyToChange[0]] =    
                x.changeto[keyToChange[i]]
        }

        saveDbFile()
        log_("//edited this dataset")
        log_(xdb[x.in][datasetToChange.key]) //show after edited     
        //log_(xdb)   
    

    } //end edit
    /*  now just put the change data into the data
        but maybe we need to do some checkings first
    */


    //test
    if ("test" in x) log_(x.test)


} //end xdb_(x)


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

//count how many dataitem in an object 
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
*/