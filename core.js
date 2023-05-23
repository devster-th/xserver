//core.js
/*this is core of the app level programs. Any people can dev module.js and then include into this core.js then core.js can pass data to the module.js */






//sales.$(core,'this is from core')

//the cor.e() takes 2 para, method_ & data_ 
exports.$ = async function (x) {
  //get input from deeji.js 
  // inpu = input that deeji.js sends
  // metho = fetch method, e.g., post, get, if skip default is 'post'


  

  //1) get & check msg
  console.log('\n//@core: received msg from @xserver')
  console.log(x)


  //2) work on the msg here ...
  if (x.method == 'post') {
    let msg = await xdev.$({
      decrypt: x.msg, 
      key: _xserver.security.key
    })
  
    console.log('\n//@core: unseal msg:')
    console.log(msg)
  
  }
  

  

  //3) then return something back to the caller
  return {
    from:'@core',
    msg:`OK, your msg #${x.id} is computing`,
  }

  


}

//2023-2-20 M/done, changed require on xdev_s.js:10, the way to run module is : module.run(...)