//use_xmongo.js
//this file is the user of the xmongo.js

const xmon = require('./xmongo.js')


  
xmon.go({
  find:{},
  coll:'fashion',
  db:'this_is_a_db'
}).then(x => console.log(x))




//done
