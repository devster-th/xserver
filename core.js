//core.js
//this is the core module that receiving input from deeji.js then this core works on it, after done, send back the output to the deeji.js, that's it.
/*  use by includes it in the deeji.js 
    const cor = require("./core.js")

    then command it:
    cor.e({act:"something"})
*/

const xdev = require("./module/xdev_s.js")
const xdb = require("./module/xdb.js")
const xmongo = require('./module/xmongo/xmongo.js')
const xfile = require('./module/xfile/xfile.js')


//the cor.e() takes 2 para, method_ & data_ 
exports.run = function (inpu,metho) {
  //get input from deeji.js 
  // inpu = input that deeji.js sends
  // metho = fetch method, e.g., post, get, if skip default is 'post'

  if (inpu == "test") {
    /*
    console.log("//core : HOLLO!")

    
    xdev.run({act:"test mongoDb"})
    xdb.run({find:"*",in:"people"})
    
    xmongo.$({
      find:{},
      coll:'fashion',
      db:'this_is_a_db'
    }).then(x => {
      console.log('//xmongo:')
      console.log(x)
    })

    /*
    xfile.$({create:'test.txt'}).then(
      xfile.$({write:'test.txt',content:'this is a test file'})
    ).then(
      xfile.$({read:'test.txt'}).then(x => {
        console.log('//xfile:')
        console.log(x) 
      })
    )
    */

    xfile.create('new_file.txt').then(
      xfile.write('new_file.txt','this is a text file, yo!')      
    ).then(
      xfile.append('new_file.txt','\nadd another line to it')
    ).then(
      xfile.read('new_file.txt').then(x => {
        console.log('//xfile:')
        console.log(x)
      })
    )
    
  
  } else {
    console.log('//core:')
    console.log(inpu)
  }


}

//2023-2-20 M/done, changed require on xdev_s.js:10, the way to run module is : module.run(...)