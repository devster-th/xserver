//deeji2.js
/* it will run at browser side and will use xdev2.js as its key tool to get all jobs done. So, deeji2.js & xdev.js work together.
*/

//import {xdev} from "./xdev2.js"
//xdev({act:"test"})

//this is initial of the deeji in the browser
globalThis._session = {  
  appName:"deeji",
  startTime:Date.now(),
  contentObject: [
    { id:1000, 
      title:"Best Latte", 
      text:"This is very very best taste of the coffee you ever had before. Belive me, try it now.", 
      pic:"/pic/goods1.jpg"},
    
    { id:2000, 
      title:"Yen ta fo", 
      text:"Yen-ta-fo is one of many many Thai dishes. It looks beautiful and the taste is sparkling your mind. Good for your today's lunch.", 
      pic:"/pic/goods2.jpeg"},

    { id:3000, 
      title:"Cookie good", 
      text:"This cake can destroy your bad mood quickly. Try one, or more now.", 
      pic:"/pic/goods3.jpg"},
  ],
  template:`<img class="picFullWidth">
            <div class="textFrame">
              <div class="textTitle"></div>
              <div class="textPara"></div>
            </div>`                     
}



function deeji(v) {
  //this is main program for deeji browser, so it starts after the page loaded.

  //test how deeji() works with xdev()
  //alert("to prove that deeji() can call xdev(), see follwing alert")
  //xdev({act:"test"})
  //=work
/*
   for (cc of BROWS.contentObject) {

    //1. create new element
    let newCont = document.createElement("div")
    newCont.className = "contentBox"
    
    //2. apply template (innerHTML)
    newCont = BROWS.template 

    //3. put info into the content frame
    //newCont.** //working here

    
    //4. add new content to the pool
    document.querySelector("#contentPool").appendChild(newCont)
  }
*/

  //simple command
  console.log(v)
  if (v=="test") alert("yo! this is from deeji2.js")


  if (typeof v=="object" && !Array.isArray(v)) {
    //complex command

    // deeji({menu:"test"})
    if ("menu" in v) {
      if (v.menu=="test") {
        xev({hide:"#menuBox"})
        alert("yo! this is test")
      }

      if (v.menu=="exit") {
        xev({innerHtml:"#messageHead",text:"this is message head"})
        xev({innerHtml:"#message",text:"this is message body"})
        xev({show:"#messageBox"})
      }
    }        










  }




}//=work