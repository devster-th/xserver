//xdev2.js
/* this program works to support deeji2.js, so the deeji2.js uses funtions in this file.
*/

function xdev(x={}) {

  if (x.act == "test") alert("yo!, this is from xdev2.js")
  if (x.act=="test call deeji2") deeji("test")


// send to server //////////////////////////////////////////////
  // xdev({ act:"send to server", formName:xyz })
  //in case not form >> xdev({act:"send to server",data:object})
  if (x.act =="send to server") {
    //test FormData
    //alert(JSON.stringify(x.fd) )

    //call itself to read the form's data
    let data_ =""
    if ("formName" in x) { //check if send form
      data_ = xdev({  act:"read form", 
                      formName: x.formName })
    }
    
    let prepData =  { act:"send to server",
                      from: 1000,
                      note:"this is message from a session",
                      data: data_, //x.data ,
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
        alert(svResp.note) 
    })
  }
  //test=passed




  //{act:"readForm", formName:xyz}
  if (x.act =="read form") {
    let formData_ = {}
    //console.log(x.formName)
    //let formName = x.formName //do this can do the following
    for (el of x.formName.elements) {
      if (el.type !="radio" && el.type !="checkbox") {
        formData_[el.name] = el.value
      } else {


        if (el.type =="radio") {
          //if the property not existed, create 1
          if (!formData_[el.name]) formData_[el.name] ="" 
          //if checked, put value in
          if (el.checked ==true) formData_[el.name] = el.value 
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
        }

        //do more with other types of form inputs
        
      }
    }
  //console.log(formData_)
  return formData_
  }
  //test=passed
  //this command right now is basic, need to do more to support
  //all type of inputs
  

// html ////////////////////////////////////////////////////////

  // {act:"show html", id:"htmlid" }
  if (x.act=="show html") {
    document.querySelector(x.id).style.display = "block"
  }

  // {act:"hide html", id:"htmlid"}
  if (x.act=="hide html") {
    document.querySelector(x.id).style.display = "none"
  }

  // {act:"menu exit"}
  if (x.act=="menu exit") {
    document.querySelector("#messageBox").style.display = "block"
    document.querySelector("#messageHead").innerHTML = "message head"
    document.querySelector("#message").innerHTML 
      = `Thank you for using this app 
        <br>Please come back anytime :-)`
    xdev({act:"hide html",id:"#menuBox"})
  }

  //for testing ....{act:"menu test"}
  if (x.act=="menu test") {
    xdev({act:"hide html",id:"#menuBox"})
    alert("this is test") 
  }


//add new html element to another existing one
/*  { act:"add new html",
      id:"___",
      name:"___",
      class:"___",
      innerHtml:"___",
      appendTo:"___"

    }
*/
  if (x.act=="add new html") {
    
  }



// id, code ////////////////////////////////////////////////////

  //gen xuid ..... xdev({act:"gen xuid"})
  if (x.act=="gen xuid") {
    return xuid()  
  }//work
  /*  this block works independently */






  //working




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

// zess() -->this to read
// zess(var) -->to save data into it
/* zess( dataToSave, pointToSave ) 
      -->update the data to some point in the zess
*/
function zess( dataToSave, pointToSave) {
  if (dataToSave==undefined && pointToSave==undefined) {
    //console.log("true")
    return JSON.parse( sessionStorage.getItem("zess") )

  } else {
    //console.log("false")
    //sessionStorage.setItem("zess", JSON.stringify(obj) )
    
    if (pointToSave==undefined) {//=save the whole var
      sessionStorage.setItem("zess", JSON.stringify(dataToSave) )    
    
    } else if (typeof pointToSave !="") {//has somewhere to save
      // zess("content.noodle",{price:100})
      let zess_ = JSON.parse( sessionStorage.getItem("zess") )
      //finding way to put a value into a point of the zessVar
      eval( "zess_." + pointToSave + "=" + JSON.stringify(dataToSave) )
      sessionStorage.setItem("zess", JSON.stringify(zess_))
    }
  }
}//working
/* 
1. how to save data to only property, eg, zess.content = {...} //done
2. add set of objects to a property

*/