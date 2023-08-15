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
    
    case 'core_info':
      return {
        module: 'core',
        brief:  "This is main module of the app running in the xserver.",
        version: '0.1',
        doc: "Will publish document soon.",
        contact: 'mutita.org@gmail.com',
        license: 'none',
        status: 'active',
        date: '2023-07-11' 
      }
      break

    default:
      return {
        msg: "Invalid input.",
        success: false,
        from: 'core.js',
        time: new Date().toISOString()
      }
  }
  
  


}
