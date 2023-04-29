//xdev.js 
/* this is the mid-level tools/framwork that make most of the low-level programs easieast so we can do more on the app-level.

USE
  const xdev = require('./module/xdev/xdev.js')

  xdev.$({keep:x, inDb:db, ...})
  xdev.$({save:s, toFile:'file.txt', ...})



*/

const xmongo = require('./xmongo.js')
const xfile = require('./xfile.js')



exports.$ = function(x) {

  if (x=='test') {
    console.log('this is xdev.js')

    xmongo.$({find:{},coll:'test',db:'simpleDb'})
    .then(x=> console.log(x))

    xfile.exist('file.txt').then(x=>console.log(x))
    xfile.read('file.txt').then(x=>console.log(x))
  }


}

exports.file = function(x) {
  //file handling
}

exports.db = function(x) {
  //mongodb handling
}

exports.xdb = function(x) {
  //xdb handling
}

exports.crypto = function(x) {
  //encrypt, decrypt, hash, coding handling
}