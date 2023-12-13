// test.js -- test module for xserver

exports.test = async function (v) {
  switch (v.act) {
    case 'info':
      return 'this is a test module'
      break

    default:
      return 'wrong input'
  }
}