//microJob.js
/*  try to make micro jobs easier by making as functions 
    micro job = job that is small, not complex normally with no parameter or very few

    we not touch the command that the language already do good but only for something sounds little complex in the language then we make it easier. that's it.
*/

//check object 
function isObjEmpty_(objName) {
    if (Object.keys(objName).length == 0) 
        console.log(true)
    else 
        console.log(false)
}

function genXuid_ (qty) {

}


function readFile_(fileName) {

}

function saveFile_(filename) {

}

function renameFile_(oldName,newName) {

}

function encrypt_(thing,algo) {}
function decrypt_(thing,algo) {}
function hash_(thing,algo) {}
function stringToBase64_(input,output) {}
function base64toString_(input,output) {}
function compress_(input) {}
function extract_(compressedVar) {}


let oo = {a:555}
isObjEmpty_(oo)