//embedSearch.js

embedSearch("> 1000")

function embedSearch(input) {
  if (/^[\>\<\=] \d+$/.test(input) ) {
    let words = input.split(" ")
    if (words[0] == ">") {
      
    }

    console.log("this is embeded search");
  } else {
    console.log("no")
  }
}



