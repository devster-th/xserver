const prompt = require('minimal-password-prompt')
const XF = require('./xfile2')
const XC = require('./xcrypto2')

prompt("Password: ").then(pass => {
  XC.$({hash: pass}).then(h => {
    XF.$({
      write: h,
      to: 'master.sec'
    })
  })
})