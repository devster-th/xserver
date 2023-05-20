//core_b.js v0.1 --core program to work on browser side

//module obj
globalThis.core = {
  programName: 'core',
  version: '0.1',
  worksOn: 'browser side',
  coder: '@mutita',
  security: {
    serverid: xdev.uuid(),
    sessionid: xdev.uuid(),
    salt: 'mutita',
    key:'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1',
    serverUrl: '/post_'
  }
}

core.formProc = async function (formid) {
  // core.formProc('#form100')

  let msg = xdev.readForm(formid)
  console.log(msg)

  //wrap.msg .....seal the msg & put in the wrap
  let msgSeal = await xdev.enc(
    JSON.stringify(msg), 
    core.security.key
  )

  let msgWrap = { msg: msgSeal }

  msgWrap.id = xdev.uuidx() + '-' + xdev.random()          
  msgWrap.to = core.security.serverid //server id
  msgWrap.from = core.security.sessionid //session id
  msgWrap.subject = ''
  msgWrap.note = ''
  msgWrap.time = Date.now()
  msgWrap.cert = await xdev.hash(
    JSON.stringify(msgWrap) + core.security.salt
  ) 

  xdev.send(msgWrap, core.security.serverUrl)


}