//sales.js
/* each module can be dev by anyone but put all f under the module object, says: sales.func() 
*/


const sales = {
  profile: {
    moduleName: '',
    version: '',
    developer: '',
    sourceCode: '',
    doc: '',
    description: '',
    license: '',
    releasedDate: ''
  }
}

sales.init = function () { 
  core.tabAct(salesTab.children[0])
}