


//use this to communicate between XS & XB, or says any computer in the network of xserver can use this model to communicate.
packet = {
  from: '<< sessionId | xserverId >>',
  to:   '<< xserverId/uuid >>',
  state: '<< register | active >>',
  msg:  {},
  packetId: '<< ip_ts_uuid >>',
  info: '',
  cert: '<< sha256 >>'
}

//this obj will attach to every doc in xdb
_xdb = {
  owner: '<<_id>>',
  change: [{time:'<<ts>>', by:'<<user._id>>'},],
  right: {},
}


eachDoc = {
  uuid: 0,
  // all data
  _sys: {
    owner: '=userId/uuid=',
    rights: [
      { who: '=userId|orgId/uuid',
        rights: 'read/write/edit/delete'
      }, 
      { who: '=userId',
        rights: ''
      }
    ],
    version: {
      name:   '=string=',
      number: '=int=',
      madeBy: '=userId=',
      time:   '=ms='
    }
  }
}


let discuss = devCommu({country:'thai'})

let packet = {
  from: 'f3c7c2a9-4dda-4d2d-880b-81f3a1abb714',
  to: 'ae44e784-f977-4b29-91e5-fbf6848d4476',
  msg: 'g+sHejBO2c2A4r6PcGiDD1DA+Y6sHBEV9WpOKaDmcRJ/eJvTO7aPcTjnVp9J7gs3JD/tP5qQsxyQtOgy8/LzuitRIUgSEXSYgtC/bW05xKeDsi+JU9IX+unNZkm86YGMeUgUDok1Qb0pe2poPFnC1IepwcQCikSTVxFp+k8RqBqmiZretHnSIbnLaxoI05/NQ5vjXHwNLfMZp89q79q2h1MHMhkV//wVZVgVdXcOyeGBrdc2v/1kLxre81a6PGsyNOmXVH094yI2CQa3HGlCYxNQ+WYAh8w3vVOTYINZjflClX6wwFPEgrZjA+phsMOAFCKUcVxhwvnrmE+ixg5S/FR0H8NOk1+caQVVJsRi0RE=',
  id: '127.0.0.1_1699006422018_bb527a72-ba72-4a50-ab76-53007737d637',
  active: true,
  cert: 'e5298e36018af5e1e1584d12af092168e28ca3ff15f436f57c3fea5843c17cf5'
}