//sales.js
/* this is a module that will be included into the core.js but the module itself can also call the core's facilities provided through the core v that passed to the module when it calls the module. */


exports.$ = function (x) {

  console.log('//sales.js test accessing XSERVER')
  console.log(XSERVER)

  console.log('//sales.js: got this data = ')
  console.log(x)

  console.log('//sales.js calls on core.message:')
  core.$({msg:'this is message from sales.js'})
  
  console.log('//sales: call xdev:',
    xdev.random()
  )




} 