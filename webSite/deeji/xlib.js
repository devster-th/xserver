// xlib.js
// this file will keep all library and hope it should help the dev works more effective
/* 
  use:
        <script src="xlib.js"></script>
*/

function download(text,fileName,fileType) {
  //take string from localStor and save to xnote.json file 

  if (text != '') {
    //alert(fileName == '')
    if (fileType == undefined) fileType = '.html' 
      else fileType = '.' + fileType 

    if (fileName == '') fileName = Date.now().toString()

    const link = document.createElement('a')
    const file = new Blob([text], {type:'text/plain'})
    link.href = URL.createObjectURL(file)
    link.download = fileName + fileType 
    link.click()
    URL.revokeObjectURL(link.href)
  } else {
    alert('ERROR: Nothing to save')
  }
  
  //done  
}

//////////////////////////////////////////////////////////////

function readFile(userSelectedFile, outputReceiver) {
  //read text file from eid then output to eid or var or if no supply of outputReceiver, just dump to console.
  /* 
      example:
                <input id="selFile" type="file">
                <button onclick="readFile(
                  selFile.files[0],
                  '#showOutputHere'
                )">Read File</button>
                <div id="showOutputHere"></div>
  */

  //let file = document.querySelector(eidOfFile).files[0]
  let reader = new FileReader()
  reader.readAsText(userSelectedFile)
  reader.onload = function() {
    //textx = reader.result 
    //console.log(textx)

    if (typeof outputReceiver == 'string' && 
    outputReceiver.includes('#')) {
      //show output in html id
      document.querySelector(outputReceiver).textContent = reader.result 
    } else if (typeof outputReceiver == 'string' &&
    !outputReceiver.includes('#')) {
      //put output in the var
      console.log(outputReceiver)
      eval(outputReceiver + '= reader.result')  
    } else {
      console.log(reader.result)
    }

  }

  reader.onerror = function() {
    console.log(reader.error)
  }

  //done, this program seems easier than the first one
}

//////////////////////////////////////////////////////////////

function csv_obj(csvText) {
  //get csv input, convert to obj then return array of obj

  let arrayy = csvText.split('\n')
  let keys = arrayy[0].split(',')
  let outputt = []

  for (i = 1 ; i < arrayy.length ; i++) { //start from 1 (data row)
    let values = arrayy[i].split(',') //get each value from each row 
    let obj = {}
    for (x = 0 ; x < keys.length ; x++) {
      obj[keys[x]] = values[x]
    }
    outputt.push(obj)
  }

  return outputt 
  
  //done 
}  

/////////////////////////////////////////////////////////////

function selec(el) {
  //shortens the command
  return document.querySelector(el)
}

/////////////////////////////////////////////

function selecAll(el) {
  //shortens the command
  return document.querySelectorAll(el)
}

//////////////////////////////////////////////////////

function toJson(obj) {
  //converts object to json
  return JSON.stringify(obj)
}

///////////////////////////////////////////////////////

function fromJson(jsonText) {
  //converts json to object
  return JSON.parse(jsonText)
}

//////////////////////////////////////////////////////

async function readForm(formid) {
  //make it smarter by auto recog all input of the form, so just put the formid to this func and it does the rest
  /* 
    use:
      onclick="readForm2('#formid').then(obj => console.log(obj)"
  */ 

  let formEl = document.querySelector(formid)
  let allinputs = formEl.elements 
  let outputObj = {}

  for (i = 0 ; i < allinputs.length ; i++) {

    if (allinputs[i].type == 'radio') { 
      
      if (allinputs[i-1].type != 'radio') { //if same, skip
        outputObj[ allinputs[i].name ] = 
          formEl[ allinputs[i].name ].value + validCheck()
      }

    } else if (allinputs[i].type == 'checkbox') {
      
      if (allinputs[i].checked) {

        if (outputObj[ allinputs[i].name ] == '' || 
            outputObj[ allinputs[i].name ] == undefined) 
        {
          outputObj[ allinputs[i].name ] = 
            allinputs[i].value 
        } else {
          outputObj[ allinputs[i].name ] += ',' + allinputs[i].value 
        }

      } else {
        //unchecked
        if (outputObj[ allinputs[i].name ] == undefined) {
          outputObj[ allinputs[i].name ] = ''
        }
      }
    } else {
      //this for ther types
      outputObj[ allinputs[i].name ] =   
        allinputs[i].value + validCheck()
    }
   
    function validCheck() {
      if (allinputs[i].hasAttribute('_invalid'))
        return '<invalid=' + allinputs[i].getAttribute('_invalid') + '>'
      else 
        return ''
    }
  }
  //console.log(outputObj)
  outputObj._valid = true 
  for (i of allinputs) {
    if (i.hasAttribute('_invalid')) {
      outputObj._valid = false  
    } 
  }

  return outputObj


  //done
  //done, added ...<invalid=.....> to each field that still be invalid, and put property _invalid:true into the outputObj
  //changed that every output from readForm2() will have _valid prop that contaning true or false so that further program can check its validity.


}

//////////////////////////////////////////////////////////




function alertBox(boxEid, msg, bgColor, showTime) {
  //get message and show it in the message box
  /* use:
          boxEid = the element id of the message box
          msg = message to be shown
          type = positive or negative, positive shows green background, neg shows orange .....future may add more level of message like 0-5 with more colors 
  */ 

  /* the message box should be like:

    <div id="msgBox" class="page-msg">
      <p id="msg"></p>
      <button 
        onclick="clearTimeout(showMsg)">Hold</button> <button 
        onclick="msgBox.style.display='none'">Close</button>
    </div>

  */ 

  /*  dependency:
        - selec() 
  */ 

  //document.querySelector(msgEid).textContent = msg 
  selec(boxEid).children[0].textContent = msg 
  //selec(boxEid).textContent = msg 
  
  /*if (type == 'positive') color = 'lightgreen'
  if (type == 'negative') color = 'orange'
  //let box = document.querySelector(boxEid)*/
  if (!bgColor) bgColor = 'Gray'

  let box = selec(boxEid)
  box.style.backgroundColor = bgColor 
  box.style.display = 'block'

  if (!showTime) showTime = 2000 
  showMsg = setTimeout( () => box.style.display = 'none', showTime )

  //done, further plan : may make 'type' to set ranking of msg like 0-5 and set the colors according to it.

  //2023-2-12 added the showTime argument so that we can set time to show the alert box but if no supply, it will do 2 secs.

  //2020-2-12 now let we set color by ourselves instead of putting 'positive,negative' just put color into it. So the func will be just show message and then close the box automatically. That's it. The design of the message box, the color will be outside of its scope. But the default color is lightgray and showTime is 2sec if nothing set.

  //the showMsg variable doesn't need to be declared first, it will becomes the global var automatically if we din't put 'let' or 'var' in front of it.
}








//////////////////////////////////////////////////////////////

function validx( valu , rule='', htmlElement ) {
  // 'valu' is the input avlue to be validated
  // 'rule' is the rule used to validate
  // this func validate each 'value' based on the supplied 'rule' then return true or false, also alert if fal


  if (rule == '') {
    console.log('no rule to validate against')
    return false 
  }

  let eachRule = rule.split(';')
  trimAr(eachRule)
  //console.log(eachRule)
  let outputx = 0 //init value

  for (each of eachRule) {

    if (each.includes(':')) {
      //console.log('has :')
      let [k,v] = each.split(':')
      //console.log(k,v)

      if (k == 'max' && valu.length > v) {
        if (rule.includes('required')) markField('background')
        else markField()
        markEl(each)
        return false 
      }

      if (k == 'min' && valu.length < v) {
        if (rule.includes('required')) markField('background')
        else markField()
        markEl(each)
        return false
      }

      if (k == 'maxValue' && Number(valu) > Number(v) ) {
        if (rule.includes('required')) markField('background')
        else markField()
        markEl(each)
        return false 
      }

      if (k == 'minValue' && Number(valu) < Number(v) ) {
        if (rule.includes('required')) markField('background')
        else markField()
        markEl(each)
        return false 
      }

      

    } else {
      //single rule , not key:value------------------------------
      //console.log('no :')
      
      if (each == 'words' && valu.match(/\W/) ) {  
        if (rule.includes('required')) markField('background')
        else markField()
        markEl(each)
        return false
      } 

      if (each == 'wordsAll' && valu.match( /[*/\\%^$#@!+]/ ) ) {
        if (rule.includes('required')) markField('background')
        else markField()
        markEl(each)
        return false 
      }

      if (each == 'digit' && valu.match(/^\D+$/)) {
        if (rule.includes('required')) markField('background')
        else markField()
        markEl(each)
        return false
      }
      
      if (each == 'required' && valu == '') {
        markField('background')
        markEl(each)
        return false
      }
       
    } //single rule
  }//for loop

  //console.log('all passed')
  markField('clear')
  markEl('clear')
  return true 

  function markField(v='') {
    if (htmlElement) {
      if (v == '') {
        htmlElement.style.border = '1px solid red'
      } else if (v == 'background') {
          htmlElement.style.backgroundColor = 'yellow'
      } else if (v == 'clear') {
          htmlElement.style.border = ''
          htmlElement.style.backgroundColor = ''
      }
    }
    //if no htmlElement supplied, does nothing
  }

  function markEl(v) {
    //set attrib to _invalid="rule" or if v = 'clear' removes the _invalid att

    if (htmlElement) {
      if (v == 'clear') {
        htmlElement.removeAttribute('_invalid')
      } else {
        htmlElement.setAttribute('_invalid', v) //this case v is rule
      }
    }
    //if no htmlElement supplied, does nothing

  }

  /*
    works fine, generally, will need to add some little finishing, such as may need to add some marks on the output so the further program knows what's not complete, or all completed, etc.

    2023-2-13   added checking htmlElement before do markField() or markEl(), by added... if (htmlElement) {} ...in both funcs
  */ 
}//validx()

///////////////////////////////////////////////////////////////

function autoFill() {

  //make this func a general purpose so it can be used in any page the devper needs, just supply proper items for it.

  /* 
    to use this funec set below:
      1) in html elements put attribute ... _fill="listVar"
      2) at beginning of <script> puts
          <script>
          var listVar = array that holds the list or table objects
          autoFill()

  */

  let valid = true  //input validity
  let thisisTable = false 
  let toFill = document.querySelectorAll('[_fill]')

  for (x = 0 ; x < toFill.length ; x++) {
    
    let tagToCreate
    if (toFill[x].tagName == 'OL' || toFill[x].tagName == 'UL') {
      tagToCreate = 'li'
    } else if (toFill[x].tagName == 'SELECT') {
      tagToCreate = 'option'
    } else if (toFill[x].tagName == 'TABLE') {
      thisisTable = true 
    } else {
      valid = false //the tagName is outside what we do here
    }

    let list = eval( toFill[x].getAttribute('_fill') )
    if (list == 'undefined') valid = false 
    
    // for non-table
    if (valid && !thisisTable) { 
      list.forEach(it => {
        let newitem = document.createElement(tagToCreate)
        newitem.textContent = it 
        toFill[x].append(newitem)
      })

    // table works
    } else if (valid & thisisTable) {
      //table work

      

      // data source is 'list'
      // element is toFill[x]

      //fill head
      let head = Object.keys(list[0])
      let tableEl = toFill[x]
      //console.log(head)

      let headEl = document.createElement('tr')
      let headHtml = '<th>#</th>'
      head.forEach(h => {
        headHtml = headHtml + `<th>${h}</th>`
      })
      headEl.innerHTML = headHtml 
      tableEl.append(headEl)

      //fill body
      let rowNum = 0
      list.forEach(doc => {
        rowNum++
        let bodyEl = document.createElement('tr')
        let bodyHtml = `<td>${rowNum}</td>` 
        for (key in doc) {
          bodyHtml = bodyHtml + `<td>${doc[key]}</td>`
        }
        bodyEl.innerHTML = bodyHtml 
        tableEl.append(bodyEl)
      })

    } else {
      console.log('may be something wrong')
    }
    

  }
  
  //done, now table also works in this function
}

////////////////////////////////////////////////////////////


function xuuid() { 
  //gen univeral unique id 
  //this func get the new timestamp and return. It guarantees that it won't return the duplicate number because it won't take the timestamp at the time of its calling but taking the next timestamp (id2)

  let id1 = Date.now()
  let id2 = Date.now()
  while (id1==id2) {
    id2 = Date.now()
  }
  return id2 
}


////////////////////////////////////////////////////////////


function show(eid) {
  //show the supplied html element
  document.querySelector(eid).style.display = 'block'
  //done 2023-2-12, M
}

function hide(eid) {
  //hide the supplied html element
  document.querySelector(eid).style.display = 'none'
  //done 2323-2-12, M
}

function alertx(v) {
  //if the v is object, shows it in json format, the rest is the default alert func.

  if (typeof v == 'object' && !Array.isArray(v)) {
    alert(toJson(v))
  } else {
    alert(v)
  }

  //done 2023-2-12, M
}


/////////////////////////////////////////////////////////////

function sess(sessName, objToKeep) {
  //save key obj to sessionStorage, read and update and save. So it likes using gernal object but save it in browser too to prevent the object loss when user refresh the browser. The format that saving in sessionStor is json.
  /* use:
      sess(objToKeep, sessName)
        objToKeep ...is the obj you like to keep in the sessStor
        sessName ...is the sessionStor var name, put in string format

      when put both value, this means you like to keep/save into sessionStor
      but if you put only sessName, means you like to read the var like:

      sess('_deeji') .....means you reads the var that saved in the name '_deeji' in sessionStor

      sess(_deeji, '_deeji') ....means you like to save the obj _deeji into sess var named '_deeji' .
  */

  /* valid check when write:
        the sessName must be string and not ''
        the objToKeep must be object

      when read:
        the sessName has to exist and not be ''
  */      


  if (sessName && objToKeep) {
    //this is the keep mode
    if (typeof sessName == 'string' && sessName != '' && typeof objToKeep == 'object'){
      sessionStorage.setItem(sessName, toJson(objToKeep) )
      return `save to sessionStorage named ${sessName} done`
    } 

  } else if (sessName && !objToKeep) {
    //this is the read mode
    let readx = sessionStorage.getItem(sessName)
    if (readx != null) {
      return fromJson(readx)
    } 

  } else if (!sessName && !objToKeep) {
    //list all keys in te sessStor
    let keyList = []
    for (i=0 ; i < sessionStorage.length ; i++) {
      keyList.push(sessionStorage.key(i))
    }
    return keyList 
  }
  //the code that reaches here is 
  return 'invalid input, none execution'
}


/////////////////////////////////////////////////////////////////////

function el(el, command) {
  //try to make this func handles the html elements easier
  /*
      el('p',{id:'firstPara', sty:'color:red'}) 
      el('#msgBox', {background-color:lightgreen})
      el('#aaaa', '_delete')
      el('p','_create')    
  */
  let el_ = document.querySelector(el)
  if ('id' in command) {
    // el(el, {id:'yo'})
    el_.id = command.id 
  }
  if ('class' in command) {
    // el(el, {class:'cccccc'})
    el_.className = command.class
  }
  if ('name' in command) {
    // el(el, {name:'nnnnnnn'})
    el_.name = command.name 
  }
}

////////////////////////////////////////////////////////////////////
/*
function xtalk(path,xdata) {
  //this func talks to the node.js server (web server) in POST method
  //e.g., xtalk('/post_', {name:'john'})
  // the xdata right now is prefering object
    
  fetch(
    path, //"/post_" 
    { 
      method:"POST",
      headers: {"Content-Type":"application/json;charset=utf-8"},
      body: JSON.stringify(xdata) 
    })
  //.then( serverResp => { return serverResp.json() })
  .then( serverResp => serverResp.json() )
  .then( x => {
    //this block is to use the serverResp as an obj
    console.log(x)   
    
  })
  
  //done, but cannot return out the obj (614, second 'then')
}
*/
      
async function xtalk(url='',xdata={}) {
  //this func talks to the node.js server (web server) in POST method
  //e.g., xtalk('/post_', {name:'john'}).then(x => console.log(x))
  // the xdata right now is prefering object
  
  if (typeof xdata != 'object') return 'invalid data, must be object'

  const serverResp = await fetch(
    url, //"/post_" 
    { 
      method:"POST",
      headers: {"Content-Type":"application/json;charset=utf-8"},
      body: JSON.stringify(xdata) 
    })
  return serverResp.json()  
    
  //done, M/2023-2-20
}