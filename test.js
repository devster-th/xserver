//test.js

let aa = {x:111111, y:222222222, z:33333333333}
let bb = {s:6666, d:88888, e:9999999999}
let source = aa
let keyList = [0, 1, 2]
//console.log(source)
for (i=0; i < keyList.length; i++) {

  if (i==0) {source = aa} else {source = bb} 
  for (key in source) {
    if (/8/.test(source[key]) ) {
      console.log(key)
    }
  }
}