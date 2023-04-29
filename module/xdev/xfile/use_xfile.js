//use_xfile.js

const xfile = require('./xfile')

xfile.exist('xyz.json').then(x => {
  if (x) {
    xfile.read('xyz.json').then(x => console.log(x))
  } else {
    xfile.create('xyz.json').then(
      xfile.write('xyz.json', JSON.stringify({name:'john'}))
    )
  }
})