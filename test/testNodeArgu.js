//testNodeArgu.js
/*  we can pass parameters/arguments to node when running commandline
    so we can do:
    $ node file.js xx yy=100
*/    

/*
process.argv.forEach( (value,index,array) => {
  //console.log(index + ": " + value)
  if (index == 2) {
    console.log(value)
  }
})
*/
if (!process.argv[2]) { //check if para=undefined or not
  console.log("no para")
} else {
  let specialPara = process.argv[2].split("=")
  console.log(specialPara )
}


/*
test=passed
so we can use this to get para from commandline and do something, perfect
/m
*/