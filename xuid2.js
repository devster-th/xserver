//xuid2.js
/* 
Try to make a next generation unique id.
    style:
        * unique forever
        * independent, runs on itself, dependent from anything else
        * can convert back to the time it created
        * ascending, so we know which comes first, which later

*/


function uuid(howMany) {

    //setting
    const charSet = 'abcdefghijklmnopqrstuvwxyz'
    const charSetLeng = charSet.length
    const shortCodeLeng = 5         //set the code length
    const output = []           //save the gen code here

    //gen as many as the 'howMany'
    for (qty=0; qty < howMany; qty++) {

        //loop to random each character
        let shortCode = ''      //restart 
        for (i=0; i < shortCodeLeng; i++) {
            shortCode += charSet.charAt(
                Math.floor(Math.random()*charSetLeng)
            )
        }
        //show code by attaching to the timestamp
        output[qty] = shortCode + Date.now() 
    }       
    console.log(output.sort() )
}

//run 
uuid(100)
