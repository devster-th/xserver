/**
 * core.js is the main program of the app/software.
 * version: 0.1
 * license: none
 * date: 2023-06-13
 * web:''
 * contact: mutita.org@gmail.com
 * 
 * @param {object} X - can have various properties  
 * @returns 
 */

/*  #use
          const core = require('./core.js')
          core.$({do:'something', ...})
*/
//the cor.e() takes 2 para, method_ & data_ 

exports.$ = async function (X) {
  
  switch (X.act) {
    
    case 'info':
      return {
        moduleName: 'core',
        brief: 'the core of this xserver platform',
        version: '0.1',
        by: 'nex.world',
        releasedDate: '2023' 
      }
      break

    default:
      return {
        msg: "Invalid input.",
        fail: true,
        from: 'core.js',
      }
  }
  
  


}
