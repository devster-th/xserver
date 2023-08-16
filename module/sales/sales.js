//sales.js
/* this is a module that will be included into the core.js but the module itself can also call the core's facilities provided through the core v that passed to the module when it calls the module. */


exports.$ = async function (X) {

  switch (X.act) {

    case 'info':
      return {
        moduleName: 'sales',
        brief: "Works on sales functions.",
        version: '0.2',
        by: 'nex.world',
        releasedDate: '2023'
      }
      break

    default:
      return {
        msg: "Invalid input.",
        fail: true,
        from: 'sales.js'
      }
  }



} 