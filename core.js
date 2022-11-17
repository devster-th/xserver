//core.js
//this is the core module that receiving input from deeji.js then this core works on it, after done, send back the output to the deeji.js, that's it.
/*  use by includes it in the deeji.js 
    const cor = require("./core.js")

    then command it:
    cor.e({act:"something"})
*/

const xde = require("./module/xev.js")
const xd = require("./module/xdb.js")


//the cor.e() takes 2 para, method_ & data_ 
exports.e = function (metho,dato) {

  if (metho=="test") {
  console.log("this is the core module")
  }

  /*
  xde.v({act:"test mongoDb"})
  xd.b({find:"*",in:"people"})

  console.log("these are xuid fro xdev")
  let round=0
  do {
    console.log(xde.v({act:"generate",code:"xuid"}) )
    round++
  } while (round < 10)


  =this block work
  */



}