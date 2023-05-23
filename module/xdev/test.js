//test.js -- AES-GCM
/**
 * ok, tested both enc at node & dec at browser, and viseversa fine
 * m/20230516
 */

//const xcrypto = require('./xcrypto')
//var crypto = require('crypto')
const xdev = require('./xdev.js')

var x = {name:'mutita'}
var j = xdev.jsonify(x)
console.log(
  j
)

console.log(
  xdev.parseJson(j)
)