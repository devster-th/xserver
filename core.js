//core.js
/*this is core of the app level programs. Any people can dev module.js and then include into this core.js then core.js can pass data to the module.js */

global.core = {
  moduleName: 'core',
  version: '0.1',
  started: new Date,
  message() {
    console.log('this is core module 0.1')
  }
}

const xdev = require("./module/xdev/xdev.js")
const sales = require('./module/sales/sales.js')



//sales.$(core,'this is from core')

//the cor.e() takes 2 para, method_ & data_ 
exports.$ = function (x,metho) {
  //get input from deeji.js 
  // inpu = input that deeji.js sends
  // metho = fetch method, e.g., post, get, if skip default is 'post'


  if (x == "test") {
    
    //console.log("//core : HOLLO!")

    
    //xdev.run({act:"test mongoDb"})
    //xdb.run({find:"*",in:"people"})
    /*
    xmongo.$({
      find:{},
      coll:'fashion',
      db:'this_is_a_db'
    }).then(x => {
      console.log('//xmongo:')
      console.log(x)
    })*/
    console.log('//core.js test simple things like show global v, call xdev.js' )
    console.log(XSERVER)
    xdev.$('test')

    /*
    xfile.$({create:'test.txt'}).then(
      xfile.$({write:'test.txt',content:'this is a test file'})
    ).then(
      xfile.$({read:'test.txt'}).then(x => {
        console.log('//xfile:')
        console.log(x) 
      })
    )
    

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
    */
  
  } else if (!x.module) {
    console.log('//core.js')
    console.log(x)

  } else if (x.module) {
    //pass data to the module
    console.log('//core.js')
    console.log(x)
    eval(`${x.module}.$(x.data)`)
  }


}

//2023-2-20 M/done, changed require on xdev_s.js:10, the way to run module is : module.run(...)