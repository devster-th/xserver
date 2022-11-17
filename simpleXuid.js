//simpleXuid.js
/* try to make a unique code simple */

function xuid_(qty) {
    let xuid = [], newCode=0
    for (i=0; i<qty; i++) {
        newCode = Date.now()
        while (newCode == xuid[i-1]) { //loop until get new timestamp
            newCode = Date.now()
        }
        xuid[i] = newCode //the code is simple timestamp with a prefix
    }
    console.log(`OUTPUT OF ${qty} XUID`)
    console.log(xuid)

}

xuid_(1)


/*NOTE
this should be good enough as it always unique and also telling sequence of time, squence of number, also easy to convert back to date & time.
*/