//genShortCode.js

/* gen short number like 3 digit, e.g., abc, efx, ...
to use with timestamp, so = xys6513546874651321
then it can be a nice little unique code. */


function genShortCode(length) {
    const charSet = 'abcdefghijklmnopqrstuvwxyz'
    let output = ''
    const charSetLeng = charSet.length
    for (i=0; i < length; i++) {
        output += charSet.charAt(
            Math.floor(Math.random()*charSetLeng)
        )
    }
    return output 
}

for (let i=0; i < 100; i++) {
    let code = genShortCode(3)
    console.log(Date.now() + code)
}