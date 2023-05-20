//test_db.js 

const xdev = require('./xdev.js')


//xdev.sha256('thailand').then(r => console.log(r))
/*
async function simpleCert(msg, key, sig) {

  //sign
  if (msg && key && !sig) {
    return xdev.sha256(msg + key)
  
  } else if (msg && key && sig) {
    //verify
    let sig_ = await xdev.sha256(msg + key)
    return (sig_ == sig)? true:false
  
  } else {
    return 'wrong input'
  }
}



simpleCert('thailand','mutita').then(r => {
  console.log(r)

  simpleCert('thailand','mutita',r).then(r => console.log(r))
})
*/


xdev.$({
  xcert: '{"name":"sunsern","age":55,"sex":"male","living":"nakorn pathom"}',
  key: '648b434f7da0f753a5f34721039bfe0bdbe3300789550e578991e7e0deb08163',
  sig: '824f200a112f3294f8770692d809b1778da9710811d4380e6ca705fade631de4'
}).then(r => console.log(r))