//xdev2.js ....changed name to xev makes it shorter
/* this program works to support deeji2.js, so the deeji2.js uses funtions in this file.
*/

function xev(x="") {

  //for basic command... x not {}
  if (x=="test") alert("yo!, this is from xev2.js")//work




//-----------------------------------------------------------------
  //for complex commands ... x = {}
  if (typeof x=="object" && !Array.isArray(x)) {


    // send to server //////////////////////////////////////////////
    // xdev({ act:"send to server", formName:xyz })
    //in case not form >> xdev({act:"send to server",data:object})


    // {send:data, to:whom}..........NOT USE
    //change to .... {sendForm:formName}
    if ("sendForm" in x) {
      //test FormData
      //alert(JSON.stringify(x.fd) )

      //call itself to read the form's data
      let data_ = xev({ readForm: x.sendForm })
      xev({send:data_})

      //?not sure if can do: xev({send: xev({readForm:x.sendForm}) })
    }//work
     

    if ("send" in x) {

      let prepData =  { send: x.send,
                        from: 1000,
                        note:"this is message from a session",
                        secureKey: 8000,
                        time: Date.now(),
                        transacid:""
                      }
    
      
      //_session.commu.out = prepData                    

      fetch("/post_", { //may be we can 'take the path as a code' too
          method:"POST",
  headers:{"Content-Type":"application/json;charset=utf-8"},
          body: JSON.stringify(prepData) 
      }).then( 
          svResp => { return svResp.json() 
      }).then( 
          svResp => {
          //the svResp is actually the object
          //_session.commu.in = svResp
          //sessionStorage.setItem("_session",JSON.stringify(_session) )
          //console.log(_session)
          clog(svResp) 
      })
    }
    //work




    //{act:"readForm", formName:xyz}....NOT USE
    // change to .... {readForm:formName}
    if ("readForm" in x) {
      let formData_ = {}
      //console.log(x.formName)
      //let formName = x.formName //do this can do the following
      for (el of x.readForm.elements) {
        if (el.type !="radio" && el.type !="checkbox") {
          formData_[el.name] = el.value

      //algo: if not radio or checkbox just copy the value
        } else {
        //this block for radio,checkbox

          if (el.type =="radio") {
            //if the property not existed, create 1
            if (!formData_[el.name]) formData_[el.name] ="" 
            //if checked, put value in
            if (el.checked ==true) formData_[el.name] = el.value 

          //algo: if it's checked, copy the value
          } 


          if (el.type =="checkbox") {
            //if property not exist, create 1
            if (!formData_[el.name]) formData_[el.name] =""
            
            if (el.checked) {
              if (formData_[el.name] =="") { //if first value
                formData_[el.name] = el.value 
              } else { //if not first value
                formData_[el.name] = formData_[el.name] +","+ el.value 
              }
            }
          //algo: if any input got checked, put them like: "aaa,bbb,ccc,..."
          }

          //do more with other types of form inputs
          
        }
      }
    //console.log(formData_)
    return formData_
    }
    //work
    //this command right now is basic, need to do more to support
    //all type of inputs
    

  // html ////////////////////////////////////////////////////////

    // {act:"show html", id:"htmlid" }........NOT USE
    // change to...... {show:"html"}
    if ("show" in x) {
      document.querySelector(x.show).style.display = "block"
    }//work

    // {act:"hide html", id:"htmlid"}.......NOT USE
    //change to..... {hide:"html"}
    if ("hide" in x) {
      document.querySelector(x.hide).style.display = "none"
    }//work

    //innerHTML ... {innerHtml:"#html", text:"text to change"}
    if ("innerHtml" in x) {
      document.querySelector(x.innerHtml).innerHTML = x.text 
    }//work



    //append html... {append:listOfContent,to:targetHtml,tag:"tag"}
    // exam: {append:arrayOfList,to:"#listHtmlid",tag:"li or option"}
    if ("append" in x) {
      //lert(1000)

      //((1)) to list
      if ("toList" in x) { //for li,option
        for (it of x.append) {
          let newitem = document.createElement(x.tag) 
          newitem.innerHTML = it   
          document.querySelector(x.toList).append(newitem)
        }
      }//work for li,option now


      //((2)) {append:arrayOfObject,toTable:"#tableHtmlid"}
      if ("toTable" in x) {
        let tabCode ="<tr>"
        //loop for table head
        for (headCol in x.append[0]) {
          tabCode += "<th>" + headCol + "</th>"
        }
        tabCode += "</tr>"

        //loop for data
        for (eachRow of x.append) {
          tabCode += "<tr>"
          for (col in eachRow) {
            tabCode += "<td>" + eachRow[col] + "</td>"
          }
          tabCode += "</tr>"
        }
        xev({innerHtml:x.toTable,text:tabCode})
      }//work
      

      //((3))
      // {append:[..], template:"..", to:"htmlElement" }
      /* {  append:[{key:val,...},{..},{..},...],
            template: contentBox,
            to:"#contentSpace",
            dataMap:{ templateVar:dataVar, ...}
          }
      */
      /* this kind of append we create new div and put template in it
      then append to the target html. So should be good for appending
      content item/box into a page.
      Add the tempTranslator to use the templating code like xht */
      if ("template" in x) {
        for (item of x.append) {
          let temPrep = xht(x.template)//only xht-template for now
          //replace the var in {{v}}
          for (temVar in x.dataMap) {
            let search_ = new RegExp(`{{${temVar}}}`,"gm")//{{pic}}
            temPrep = 
              temPrep.replace(search_, item[x.dataMap[temVar]])
          }
          let newEl = document.createElement("div")
          newEl.innerHTML = temPrep 
          document.querySelector(x.to).append(newEl)
        }

        
      }//work
      /*logic: loop the data, get the template and translate it into html, fill the vars, create new element, put already prep template into new ele, append the new ele into the target ele. 
      
      the dataMap is mapping the data's var to the template's var, eg,
        dataMap:{pic:"goodsMainPic", text:"goodsBrief"} 
      this way the template and data are independent, just map what we need. */

    }//end of append



  // id, code ////////////////////////////////////////////////////

    // {gen:"xuid"} 
    // a unique timestamp number 
    if ("gen" in x && x.gen=="xuid") {
      return xuid()  
    }//work
    /*  this block works independently */


    // {gen:"hash", input:"...."}
    // hashes input string into sha-256 codes (hex)
    if ("gen" in x && x.gen=="hash") {
      //alert("yo")
      return sha256(x.input)
    }//work


    // {gen:"uuid"}
    // 32-digit universal unique id
    if ("gen" in x && x.gen=="uuid") {
      return self.crypto.randomUUID()
    }//work


    // {gen:"randomNum"}
    // gen only 1 random per request 
    if ("gen" in x && x.gen=="randomNum") {
      const output = new Uint32Array(1)
      self.crypto.getRandomValues(output)
      return output[0]
    }//work



  // conversion //////////////////////////////////////////////////

    //  xht...  {convertXht:xhtSource}
    /*  EXAM    xev({convertXht:"p/........../p"})      */
    if ("convertXht" in x) {
      return xht(x.convertXht)
    }//work
    /*can use xht(v) same thing */




  //working


  }//end of general commands...x={}

}//end xdev(x)


//////////////////////////////////////////////////////////////
/* move sesD here (renamed from sessDb), shorter the better
*/

// sesionDb ////////////////////////////////////////////////
/* this is a tiny db that resides in the sessStor, may be make it for localStor too. */

/*  command style:
    sesD({create:{db:"_deeji",coll:"aaa bbb ccc"})
    sesD({add})
*/

function sesD(x={}) {

  let sesD_ = {}

  //below block x=string, special commands
  if (rdSess("sesD")==null) {
    //lert("no sessD yet")
    svSessDb("sesD",
      {_int:{
        app:"sesD",
        version:"0.1"
      }}
    )
    clog("sesD initted in the sessionStor done")
  } else {
    //sesD_ = rdSessDb("sesD") //don't need to read at this time
  }
  /**may be not really init until there's a creation of the fist dataset */

  
  //test
  if (x=="test") clog(`yo!, this is sesD, a browser database version: ${sesD_._int.version}`)

  if (x=="read whole") {
    return rdSessDb("sesD")
  }



  //below block for x=obj and will work for sesD commands
  if (typeof x=="object" && !Array.isArray(x)) {


    // {create:{coll:"aaa bbb ccc"}}
    if ("create" in x) {
      let sesD_ = rdSessDb("sesD")
      if ("coll" in x.create) {
        let collSet = x.create.coll.split(" ")
        for (coll_ of collSet) {
          sesD_[coll_] = {}
        }  
      }        
     svSessDb( "sesD",sesD_ )
     clog(rdSessDb("sesD"))
    }//work 

  
    // {add:{...},coll:"collName"}
    if ("add" in x) {
      let sesD_ = rdSessDb("sesD")
      if (Array.isArray(x.add)) {//array=many docs
        for (doc of x.add) {
          let xuid_ = xuid()
          doc._id = xuid_ 
          sesD_[x.coll][xuid_] = doc 
        } 
      } else { //add only 1 doc
        let xuid_ = xuid()
        x.add._id = xuid_ 
        sesD_[x.coll][xuid_] = x.add 
      }
      svSessDb("sesD",sesD_)
      clog(rdSessDb("sesD"))
    }//work
      
 
  
    /*  {find:{name:"j"},coll:"collName"}
    */
    if ("find" in x) {
      let sesD_ = rdSessDb("sesD")
      let searchKey = Object.keys(x.find)[0] //only 1 key first
      let regex = new RegExp(x.find[searchKey],"i")
      let output =[]
      for (docid in sesD_[x.coll]) {
        if (searchKey in sesD_[x.coll][docid]) {
          if (sesD_[x.coll][docid][searchKey].match(regex)) {
            output.push(sesD_[x.coll][docid]) 
          }
        }
      }//work


      //edit ... {find:{..},edit:{..},coll:"cccc"}
      if ("edit" in x) {
        let count = 0
        for (doc of output) {
          
          //in each doc, fill each key
          let keysToEdit = Object.keys(x.edit)
          for (kk of keysToEdit) {
            doc[kk] = x.edit[kk]
          }
          sesD_[x.coll][doc._id] = doc 
          count++
        }
        svSessDb("sesD",sesD_)
        clog(`sesD edited ${count} doc in ${x.coll}`)

        //work
      } else if ("delete" in x) {

        //delete ... {find......, delete:"doc"}
        // ..., delete:{key:"keyToDelete xxx xxx"}
        //take output from find to delete that doc
         
        sesD_ = rdSessDb("sesD") //get latest update
        let count=0
        for (doc of output) {
          if (x.delete=="doc") {
            delete sesD_[x.coll][doc._id]
          count++
          } else if (typeof x.delete=="object") {
            let keyToDelete = x.delete.key.split(" ")
            for (kk of keyToDelete) {
              delete sesD_[x.coll][doc._id][kk]
            }
            count++
          } else {//delete nothing
          }
        }
        svSessDb("sesD",sesD_)
        clog(`sesD delete affected ${count} doc of the ${x.coll}`)
        
        //work  
      } else {

        return output //if no edit or delete then just return output of the search
      }


    }//end of find
    //work,for 1 key word


    







  }//end of db command block

 


}//end sesD(x)
/**generally work now, for create,add,find,edit,delete commands 
 * 
*/
 













//LITTLE TOOLS THAT MAKING DEV MORE QUICKER, AND CLEANER
//can be used within xdev() or else

function el(v) {
  return document.querySelector(v)
}


function clog(v) {
//shorter console.log(v)
  return console.log(v)
}

function lert(v) {
//alert everything included object: {...}
  if (typeof v==="object" && !Array.isArray(v)) {
    v = mkJson(v)
  }
  alert(v)
}

function mkJson(o) {
  return JSON.stringify(o)  
}

function rdJson(s) {
  return JSON.parse(s)
}

function svSess(key,val) {
  sessionStorage.setItem(key,val)  
}

function rdSess(key) {
  return sessionStorage.getItem(key)
}

function svLoc(key,val) {
  localStorage.setItem(key,val)
}

function rdLoc(key) {
  return localStorage.getItem(key)
}

function rdSessDb(dbName) {
  return rdJson( rdSess(dbName) )
}

function svSessDb(dbName,val) {
  sessionStorage.setItem(dbName, mkJson(val))
}

function delSess(key) {
  sessionStorage.removeItem(key)
}

function xuid() {
//gen xuid   
  let init = Date.now() 
  let xuid = Date.now()
  while (xuid==init) {
    xuid = Date.now()
  } 
  return xuid.toString() 
}

// rdSessV()
function rdSessV() {
  return JSON.parse( sessionStorage.getItem( "sessV"))        
}

// addSomeClass("aaa bbb ccc",)
function addSomeClass(classNames,toElement) {
  if (/ /.test(classNames)) {
    let someClass = classNames.split(" ")
    for (cc of someClass) {
      toElement.classList.add(cc)
    }
  } else {
    toElement.classList.add(classNames)
  }      
}




// xess() -->read mode
// xess().people.name --> read specic property
// xess(data) -->write mode
/* xess( data, toWhere, how ) 
      -->update the data to some point in the zess
*/
function xess( dataa, toWhere, how ) {

  //input==none, -->read mode
  if (!dataa && !toWhere) {
    //console.log("true")
    return JSON.parse( sessionStorage.getItem("xess") )

  //write mode
  //has data but not specify where
  } else if (dataa && !toWhere && !how) {
    let xess_ = JSON.parse(sessionStorage.getItem("xess"))    
    xess_ = dataa 
    sessionStorage.setItem("xess", JSON.stringify(xess_))

  //has data + specify where to save
  /* xess(data,"content","add") -->add data to existing content
  */
  } else if (dataa && toWhere && how) {
    //alert("data + to + how")
    let xess_ = JSON.parse(sessionStorage.getItem("xess"))  
    if (how=="add") {
      //alert("add")
      if (Array.isArray(eval("xess_." + toWhere))) {
        if (!Array.isArray(dataa)) {
          eval("xess_." + toWhere + ".push(dataa)")
        } else {
          //if the data itself is array, should add it 1 by 1
          for (eachitem of dataa) {
            eval("xess_." + toWhere + ".push(eachitem)")
          }
        }

      }
      else console.log("xess: not add, the target point is not array")
    }   
    //if no add just replace the existing data
    else eval("xess_." + toWhere + "= dataa")
    sessionStorage.setItem("xess", JSON.stringify(xess_))
  
  } else if (dataa && toWhere) {
    //alert("data + to")
    let xess_ = JSON.parse(sessionStorage.getItem("xess"))  
    eval("xess_." + toWhere + "= dataa") 
    sessionStorage.setItem("xess", JSON.stringify(xess_))
  }
}//testing
/* 
1. generally work, but if the toWhere is more deep then problem =solved using eval()
2. if push into non-array got problem =solved 524-525
3. if the data to add is array then it should add 1 by 1, not just add the array into it =solved 529
*/






/////////////////////////////////////////////////////////////////
/*  xht -- is the program that shorten the writing of html
    so we can write shorter codes then let it converts to 
    the real html afterward. 
    
    USE
    let realHtml = xht(xhtCodes)

    SAMPLE OF XHT CODE
    p/.................../p
    div/......................./div
    img>src:/pic/nicePic.jpg>
    a>href:http://deeji.world>this is a link/a

    table/
    th/Name,Age,Sex,Country/
    td/John,22,male,Thailand/
    td/Jane,18,female,Sigapore/
    /table

    div>class:contentBox>
      img>src:nicePic.jpg>
      div>class



    */

function xht(vv) {
  console.log("RUN")

  //the head
  vv = vv.replace(
/(?<!\<.*)(p|h[1-6]|div|li|[uo]l|button|but|form|mark|span|table|select|sel|input|hr|br|img|div|option|opt|a|b|i|u)(\/|\>([^\s]+?)\>)/gm,
    (full,g1,g2,g3)=>{
      //g1:tag, g2: / or option, g3:attribute-block inside the option
      console.log("//head")
      console.log(full)
      console.log(g1)
      console.log(g2)
      console.log(g3)

      if (g1=="but") g1="button"
      if (g1=="opt") g1="option"
      if (g1=="sel") g1="select"

      let headTag = `<${g1}`
      
      //work on option/attributes
      if (g3 !=undefined) { //has option
        let att = ""
        if (g3.includes(",")) { //if has > 1 att
          let attBlock = g3.split(",") 
          attBlock.forEach(item => {
            let colon = item.indexOf(":")
            att += ` ${item.slice(0,colon)}` + `="${item.slice(colon+1)}"`
          })

        } else {
          let colon = g3.indexOf(":")
          att += ` ${g3.slice(0,colon)}` + `="${g3.slice(colon+1)}"`
        }
        return headTag + att + ">"
      } else {
          return `<${g1}>`
      }
    }
  )//work
  
  
  //table 
  vv = vv.replace(
    /^(?<!\<)(t[hd])\/([^/]+)\/$/gm, (full,g1,g2)=>{
      console.log(full)
      console.log(g1) //tag: th, td
      console.log(g2) //the row body like: name,age,sex

      let row ="<tr>" //start the row  
      let rowBlock = g2.split(",") //if manay column will split by ,
      for (item of rowBlock) {
        row += `<${g1}>` + item + `</${g1}>`
      }
      return row + "</tr>" 
    }
  )


  //the tail
  vv = vv.replace(
/(?<!\<|\-)\/(p|h[1-6]|div|li|ul|ol|button|but|form|mark|span|table|select|sel|option|opt|a|b|i|u)(?!.*\")/gm, 
    (full,g1)=>{

      if (g1=="but") g1="button"
      if (g1=="opt") g1="option"
      if (g1=="sel") g1="select"
      return `</${g1}>`
}
  )//work


  //auto close tag.....not work yet
  vv = vv.replace(
    /^\<(li|option|h[1-6])\>((?!\<\/(li|option|h[1-6])\>).)+$/gm, 
      (full,g1)=>{
        console.log("//auto-close")
        console.log(full)
        console.log(g1)
        
        return full + `</${g1}>` 
      }
  )//work 


  //the var-field {{vvv}}
  //following for test
  //let pic="/pic/goods1.jpg" 
  //let title="This is best product"
  //let text="if you never buy this, do it now!"
/*
  vv = vv.replace(
    /\{\{(\w+)\}\}/gm, (full,g1)=>{
     try {
      return eval(g1) //the text in the {{..}} will become var 
     } catch(error) {
      //got error, may be the var not exist
      console.log(error) //notify error 
      return full //not change anything 
     }
  })//work
*/  
  /*take this out, may be make another block to do this  */


  //the blank-space : ......./---/...... this for 3 spaces
  vv = vv.replace(
    /\/(\-+)\//gm, (full,g1)=>{
      console.log(full)
      console.log(g1)
      spaceSet = ""
      for (count=0; count < g1.length; count++) {
        spaceSet += "&nbsp;"
      }
      return spaceSet 
    }
  )//work




  return vv 

}//end of xht()


// lobid ///////////////////////////////////////////////////////
/*  a local or browser db, very very simple one 
    stores data in json in localStorage, in var named 'lobid'

    PATTERN
    lobid(cc) --> cc stands for 'command'

    USE
    lobid() -->read whole db
    lobid().people --> read people's data
    lobid({.......}) -->write whole new data into it, replace everything
    lobid(doc,block)

    lobid({ _find:"name = j", block:"people" })
            _find:"stock > 50"
            _edit:"stock +1"

    lobid("people.name == j")            

*/

function lobid(doc,bloc) {
  if (!doc && !bloc) return JSON.parse(localStorage.getItem("lobid"))
  else {
    if (doc && bloc) {
      let lobid_ = JSON.parse(localStorage.getItem("lobid"))
      if (Array.isArray(doc)) {
        for (eachDoc of doc) {
          lobid_[bloc].push(eachDoc)
        }
      } else {
        lobid_[bloc].push(doc)
      }
      localStorage.setItem("lobid",JSON.stringify(lobid_))
    } else if (doc && !bloc) { //working here
        if (typeof doc =="string") {
          //lobid("people.name = john")
          let lobid_ = JSON.parse(localStorage("lobid"))
          let block =""
          let tail = doc.replace(/(.+)\./, (full,g1)=>{
            //full = full match, g1 = group1 which is a db's block
            block = g1 
            return ""
          })
          tail = tail.replace(/\=/,"==")
          tail = tail.replace(/\.+ /,"")
          let output =[]
          for (eachDoc of lobid_[doc.block]) {
            if (commandd[2]==eachDoc[dataStruc[1]]) {
              output.push(eachDoc)
            }
          }           
          return output 
        }
      } else {
        localStorage.setItem("lobid",JSON.stringify(doc))
      }
    }
      
      
  /*working on find */
  }


// hash //////////////////////////////////////////////////////
/*  this is SHA-256 only 
    this func takes time so make sure we wait until get the result
    USE
        sha256("....").then( output => {...do things here...})
*/
async function sha256(msg) {
  const msgUint8 = new TextEncoder().encode(msg)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map( 
    (b) => b.toString(16).padStart(2,"0")).join("")
  return hashHex
}