


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