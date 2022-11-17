//xdb.js
/* the command pattern is follow:

    xdb_(x)

example:
    {create: {db:"xyz"},
        collection:"people goods order"} }
    
    {add: {people:[
        {name:"john",age:22,sex:"male"}
        {name:"jane",age:18,sex:"female"},
        {...}, ...
        ]}
    }

    {edit: {people: {name:"john"},
        tobe: {note:"this is good man"}
    }}

    {find: {people: {name:"john"} }}

    {delete: {people: {name:"john"} }}

*/


//INITIALIZATION
const fileSys   = require("fs")
const xdb       = {}
const xdbFile   = "xdb.json"

//read dbx.json
fileSys.readFile(xdbFile,"utf8",(error,data)=>{
    xdb = JSON.parse(data)
    console.log("//loaded dbx.json")
    console.log(xdb)
})



function saveDbFile() {
    fileSys.writeFile( xdbFile, JSON.stringify(xdb), 
        (error)=>{
            if (error) throw error 
        //console.log("//saved xdb.json")
    } )
}
//saveDbFile() 

//COMMAND
/*
//creat
vv({create:{collec:["people","goods","order"]}})

//add
vv({add:{name:"john",age:22,sex:"male"},in:"people"})
vv({add:{name:"jane",age:18,sex:"female"},in:"people"})
vv({add:{name:"dad",age:54,sex:"male"},in:"people"})
vv({add:{name:"mom",age:53,sex:"female"},in:"people"})

vv({add:{name:"noodle",price:100,qty:100},in:"goods"})
vv({add:{name:"ga praou",price:55,qty:56},in:"goods"})
vv({add:{name:"coffee",price:66,qty:562},in:"goods"})
vv({add:{name:"steak",price:65,qty:4562},in:"goods"})

vv({add:{goods:"steak",price:65,qty:22,date:"2022-1-1"},in:"order"})
vv({add:{goods:"coffee",price:2000,qty:500,date:"2022-2-2"},in:"order"})
vv({add:{goods:"noodle",price:10000,qty:325,date:"2022-3-3"},in:"order"})

console.log("ALL DATA NOW IS")
console.log(xdb)


*/

// WAITS 1 SEC TO WORK
//find
setTimeout( ()=> {
    xdb_({find:{qty:"> 100"},in:"goods"})
    xdb_({add:{name:"meat ball",price:65,qty:100},in:"goods"})

    console.log(xdb)

},1000)


//PROGRAM
function xdb_(x) {
    if ("create" in x) {
        for (i=0; i < x.create.collec.length; i++) {
            xdb[x.create.collec[i]] = {}
        }
    console.log("CREATE OUTPUT")
    console.log(x)
    console.log(xdb)
    saveDbFile()
    }

    if ("add" in x) {
        xdb[x.in][ genShortCode(4) + Date.now() ] = x.add
        saveDbFile()
        console.log(xdb[x.in])
        /*
        console.log("ADD OUTPUT")
        console.log(x)
        console.log(x.in)
        console.log(xdb[x.in]) */
    }

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


//ADD-ON FUNCTION
// let code = genShortCode(3)

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







/*///////// NOTE ///////////
  
- now working on find to handle... { find:{price:"> 100" }




*/