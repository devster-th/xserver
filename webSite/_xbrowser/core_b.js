//core_b.js v0.1 --core program to work on browser side

//module obj
globalThis.core = {
  programName: 'core',
  version: '0.1',
  worksOn: 'browser side',
  coder: '@mutita',
  security: {
    serverid: '35af4272-c5c2-48c7-8a37-6ed1a703a3f6',
    sessionid: xdev.uuid(),
    salt: 'Ac+G_^;axLHq',
    key:'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1',
    serverUrl: '/post_'
  }
}


core.formProc = async function (formid) {
  // core.formProc('#form100')

  let msg = xdev.readForm(formid)
  //console.log(msg)

  //wrap.msg .....seal the msg & put in the wrap
  let msgSeal = await xdev.enc(
    JSON.stringify(msg), 
    core.security.key
  )

  let wrap = new Wrap //born new wrap from a master/template/class

  wrap.msg = msgSeal
  wrap.to = core.security.serverid //server id
  wrap.from = core.security.sessionid //session id
  wrap.confidential = 'module only'

  wrap.cert = await xdev.$({
    xcert:  JSON.stringify(wrap),
    key:    core.security.salt
  }) 

  //send
  xdev.send(wrap) //, core.security.serverUrl)

}


core.superPassword = async function (passHash) {
  //the hash is the signature getting from the form

  //wrap
  let wrap = new Wrap
  wrap.msg = passHash
  wrap.subj = 'super password'
  wrap.to = core.security.serverid
  wrap.from = core.security.sessionid
  
  //cert
  wrap.cert = await xdev.$({
    xcert: xdev.jsonify(wrap),
    key: core.security.salt
  })

  xdev.send(
    wrap, 
    //core.security.serverUrl
  )
}