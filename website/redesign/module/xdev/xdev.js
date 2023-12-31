//xdev.js
//key tool to form an entire app
/* it can be called a dev-language or object-language, format is like:

  xdev({
    create: 'el',
    el: 'p',
    textContent: 'yooooooooooooooooooooooo!',
    class: 'aaaa bbbb cccc ddddd',
    style: 'aaaa="xxxx;bbbb:yyyy"',
    id: 'sssssss',
    hidden: true,
    appendTo: document.body
})

simple like that, so we may cover commands like: create, edit, rename, delete, save, send, .... more & more

*/

var xdev = {}

function x_(x) {
  if (typeof x == 'object' && Object.keys(x).length > 0) {
    switch (Object.keys(x)[0]) {

      case 'makeBase64':
        return makeBase64()
        break
        // x_({ makeBase64: 'string' })

      case 'readJsonFrom':
        return readJsonFrom()
        break
        // x_({readJsonFrom: 'jsonString' })

      case 'makeJsonOf':
        return makeJsonOf()
        break
        // x_({makeJsonOf: x }) ....return json string of x 

      case 'readAttrib':
        return readAttrib()
        break
        // x_({readAttrib:'aaa', ofEl:'#abc'})

      case 'pickEl':
        pickEl()
        break 
        //pick 1 or more el then do something

      case 'el':
        return el()
        break 
        // select 1 or more el then return the el

      case 'genXuuid':
        return genXuuid()
        break 
        // xe({ genXuuid: 1 }) ....gen 1 xuuid


      case 'makeSnake':
        return makeSnake()
        break 

      case 'makeTitleCase':
        return makeTitleCase()
        break 
        /*  xe({  makeTitleCase: 'this is thailand',
                  separator: ' ',
              })
        */


      case 'makeCamel':
        return makeCamel()
        break
        /* xe({ makeCamel: 'this is string',
                separator: ' ' | '-' | ',' ...whatever
            })
        */

      case 'showTheseEl':
        showTheseEl()
        break 
        // xe({ showTheseEl:[1 or some el], fromAllEl: [all el] })
        // show some, hide some

      case 'cancelTimer': // xe({cancelTimer: X1.message.timerName})
        cancelTimer() 
        break 

      case 'showThis': // xe({showThis:el, forLong:2000})
        showThis()
        break 

      case 'hideThis':
        hideThis() // xe({ hideThis: el })
        break

      case 'saveToSessionVar':
        // xe({ saveToSessionVar: '_x', obj: x })
        session('save')
        break 

      case 'readFromSessionVar':
        // xe({ readFromSessionVar: '_x' })
        return session('read')
        break 

      case 'replaceClass': 
      // xe({replaceClass:'w3-black', with:'w3-white, onEl:el})
        replaceClass()
        break 

      case 'loadHtmlFile':
        loadHtmlFile()
        break
        //insert html file into this file

      case 'showEl':
        showEl()
        break 

      case 'createEl':
        return createEl()
        break
        //create el and set something includes appending it to another el

      case 'edit':
        xedit()
        break

      case 'delete':
        xdelete()
        break 


      case 'jsid':
        //x_({genCcode:8}) ....gen 8 digits like abcdsdkf , the code is A-Za-z only
        return jsid()
        break 

      case 'randomInt':
        //x_({randomInt:'20-60'})
        return randomInt()
        break 

      case 'password':
        //x_({password:32}) ....gen 32-char of password
        return password()
        break

      case 'rotateA':
        //x_({rotateA: array, round:10}) ...rotate a to left side and the first one moves to last
        rotateA()
        break

      case 'rotateAl':
        //same as above but just add 'l' in the command
        rotateA()
        break

      case 'rotateAr':
        //rotate right
        rotateAr()
        break

      case 'thaiNum':
        //convert 0-9 to thai num ๐-๙ and works for many digit
        //x_({thaiNum:123456}) ...gets ๑๒๓๔๕๖
        return thaiNum()
        break

      case 'thaiDay':
        return thaiDay()
        break

      case 'thaiMonth':
        return thaiMonth()
        break

      default:
        return 'command not supported'
    }
  } else {
    return 'xdev: invalid command' 
  }


  /////////////////////////////////////////////////
  function thaiMonth() {

    const thaiMonth = [
      { english:'January',
        thai:'มกราคม',
        code:'มค'},
      { english:'February',
        thai:'กุมภาพันธ์',
        code:'กพ'},
      { english:'March',
        thai:'มีนาคม',
        code:'มีค'},
      { english:'April',
        thai:'เมษายน',
        code:'มย'},
      { english:'May',
        thai:'พฤษภาคม',
        code:'พค'},
      { english:'June',
        thai:'มิถุนายน',
        code:'มิย'},
      { english:'July',
        thai:'กรกฎาคม',
        code:'กค'},
      { english:'August',
        thai:'สิงหาคม',
        code:'สค'},
      { english:'September',
        thai:'กันยายน',
        code:'กย'},
      { english:'October',
        thai:'ตุลาคม',
        code:'ตค'},
      { english:'November',
        thai:'พฤศจิกายน',
        code:'พย'},
      { english:'December',
        thai:'ธันวาคม',
        code:'ธค'},
    ]

    if (x.thaiMonth) {
      let m = thaiMonth.find(item => 
        item.english.toLowerCase().match(x.thaiMonth.toLowerCase())
      )
      if (m) return [m.thai, m.code]
      else return false 
    }
  }



  /////////////////////////////////////////////////
  function thaiDay() {
    //from Monday > จันทร์ , Tuesday > อังคาร ...
    //x_({thaiDay:'Monday'}) ....gets จันทร์
    //return both day name & code like ['จันทร์','จ']

    const thaiDay = [
      { english: 'Monday',
        thai: 'จันทร์',
        code: 'จ'},
      { english: 'Tuesday',
        thai: 'อังคาร',
        code: 'อ'},
      { english: 'Wednesday',
        thai: 'พุธ',
        code: 'พ'},
      { english: 'Thursday',
        thai: 'พฤหัสบดี',
        code: 'พฤ'},
      { english: 'Friday',
        thai: 'ศุกร์',
        code: 'ศ'},
      { english: 'Saturday',
        thai: 'เสาร์',
        code: 'ส'},
      { english: 'Sunday',
        thai: 'อาทิตย์',
        code: 'อา'},
    ]

  if (x.thaiDay) {
    let day = thaiDay.find(item => item.english.toLowerCase().match(x.thaiDay.toLowerCase()))
    if (day) return [day.thai, day.code] 
    else return false
  }
  
}//M:ok 2023-4-14


  /////////////////////////////////////////////////
  function thaiNum() {
    //convert 0-9 to ๐-๙ and support multi digits
    //x_({thaiNum:12345}) ....gets ๑๒๓๔๕

    let tn = '๐๑๒๓๔๕๖๗๘๙'
    x.thaiNum = x.thaiNum.toString()

    if (x.thaiNum.match(/^\d+$/)) {
      //all input must be digit 0-9
      if (x.thaiNum && x.thaiNum.length > 1) {
        //multi digits
        let outp = ''
        for (di=0; di < x.thaiNum.length; di++) {
          outp = outp + tn.charAt( x.thaiNum[di] )
        }
        return outp
      } else {
        // 1 digit
        return tn.charAt(x.thaiNum)
      }
    } else {
      //not digit
      return false
    }
    
  }//M:ok 2023-4-14 , if the digit is many there'll be some strange due to the handling of the display of number of js, guess



  /////////////////////////////////////////////////
  function rotateAr() {
    //x_({rotateAr: array, round:10}) ...rotate right 10 rounds
    if (!x.round) x.round = 1
    for (r=0; r < x.round; r++) {
      x.rotateAr.unshift( x.rotateAr.pop() )
    }
  }//M:ok 23-4-13

  
  
  /////////////////////////////////////////////////
  function rotateA() {
    //x_({rotateA: array, round:10}) ...rotate left 10 rounds
    if (!x.round) x.round = 1
    for (r=0; r < x.round; r++) {
      x.rotateA.push( x.rotateA.shift() )
    }
  }//M:ok 23-4-13



  //////////////////////////////////////////////////
  function makeBase64() {
    //convert string to Base64
    // x_({ makeBase64: 'string' })

    if (x.makeBase64 && typeof x.makeBase64 == 'string') {
      return btoa(x.makeBase64)
    }
  }



  //////////////////////////////////////////////////
  function readJsonFrom() {
    //parse json to x
    // x_({ readJsonFrom: 'json string' })

    if (x.readJsonFrom && typeof x.readJsonFrom == 'string') {
      return JSON.parse(x.readJsonFrom)
    }
  }//M:OK, 2023-3-23



  //////////////////////////////////////////////////
  function makeJsonOf() {
    //make json from x
    // x_({ makeJsonOf: x })

    if (x.makeJsonOf && typeof x.makeJsonOf == 'object') {
      return JSON.stringify(x.makeJsonOf)
    }
  }//M:OK, 2023-3-23



  //////////////////////////////////////////////////
  function readAttrib() {
    //read attrib from an el
    // x_({ readAttrib:'_space', ofEl:'#elid' })

    if (x.readAttrib && x.ofEl) {
      if (typeof x.ofEl == 'string') {
        x.ofEl = document.querySelector(x.ofEl)
      }

      return x.ofEl.getAttribute(x.readAttrib)
    }
  }//M:OK, 2023-3-22



  //////////////////////////////////////////////////
  function pickEl() {
    //pick an el and do something on it
    /* xe({ pickEl: '[_spaceTitle]',
            addClass: 'aaaa bbbb ccccc'   })*/

    if (x.pickEl) {

      let el = x_({ el: x.pickEl }) 
       
      if ('addClass' in x) {
        
        if (el.length) {
          //multi el here
          for (i=0; i < el.length; i++) {
            addClass(el[i])
          }

        } else {
          //1 el
          addClass(el)
        }
       
        function addClass(el) {

          if (x.addClass.includes(' ')) {
            //multi class to add
            let a = x.addClass.split(' ')
            a.forEach(c => {
              el.classList.add(c)
            })
          } else {
            //1 class to add
            el.classList.add(x.addClass)
          }
        }
      }//m:ok


      if ('replaceClass' in x) {
        //xe({ pickEl:'eee', replaceClass:'ccc', with:'ssss' })
        //if existing class not matched, not replace
        if (el.length) {
          for (i=0; i < el.length; i++) {
            repClass(el[i], x.replaceClass, x.with)
          } 
        } else {
          repClass(el, x.replaceClass, x.with)
        }

        function repClass(el, old, neww) {
          el.classList.replace(old, neww)
        }
      }//m:ok


      if ('resetClassWith' in x) {
        //xe({ pickEl:'el', resetClassWith:'aaa bbb ccc' })
        if (el.length) {
          for (i=0; i < el.length; i++) {
            el[i].className = x.resetClassWith
          }
        } else {
          el.className = x.resetClassWith
        }
      }//m:ok

      //the properties other than the first one & above regarded as attri
      if (Object.keys(x).length > 1) {
        for (k of Object.keys(x)) {
          if (k.match(/pickEl|addClass|replaceClass|resetClassWith/)) {
            //skip
          } else {
            //other than above just make it as attri
            el.setAttribute(k, x[k])
          }
        }
      } //M:ok 2023-3-31
    }            
  }


  //////////////////////////////////////////////////
  function el() {
    // select 1 or more el then return
    /*  xe({  pickEl: 'p' | 'div' | '#aaaaaa' | '.cccccc' , ...
              setClass: 'aaa bbb ccc'
    */

    if (x.el) {
      
      /*if (x.el.includes('#') ) {
        //this is select id so will get only 1 el
        return document.querySelector(x.el)
      } else {*/
        // > 1 el
        let a = document.querySelectorAll(x.el)
        if (a.length == 1) return a[0] //if only 1 in a, just give the el
        else if (a.length == 0) return null  
        else return a //give array of el
      //}

    } else {
      //invalid input
      return null
    }
    //use only querySelectorAll 

  }//




  //////////////////////////////////////////////////
  function genXuuid() {
    // xe({ genXuuid: 1 | any n })

    if (x.genXuuid > 1) {
      let a = []
      for (i=0; i < x.genXuuid; i++) {
        let n1 = Date.now()
        let xuuid = Date.now()
        while (xuuid == n1) {
          xuuid = Date.now()
        }
        a.push(xuuid)
      }
      return a 

    } else {
      // gen 1 code
      let n1 = Date.now()
      let xuuid = Date.now()
      while (xuuid == n1) {
        xuuid = Date.now()
      }
      return xuuid 
    }

  }



  ///////////////////////////////////////////////////
  function makeSnake() {
    //similar to xMakeCamel but snake_case
    //also make all string to lower case
    //can use x.separator or x.sep or if blank put ' ' as default

    x.makeSnake = x.makeSnake.toLowerCase()
    let words = x.makeSnake.split(x.separator? x.separator : x.sep? x.sep : ' ')
    return words.join('_')
  }



  ///////////////////////////////////////////////////
  function makeTitleCase() {
    //similar to xMakeCamel but TitleCase

    let words = x.makeTitleCase.split(x.separator? x.separator : x.sep? x.sep : ' ')
    for (i=0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1)
    }
    return words.join('')
  }//m:ok, 2023-3-17


  ///////////////////////////////////////////////////
  function makeCamel() {
    //get strings and then return camelCase string
    
    /*  xe({  makeCamel: 'this is string for making camel'
              separator: ' ' 
          })
    */

    let words = x.makeCamel.split(x.separator? x.separator : x.sep? x.sep : ' ')
    for (i=1; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1)
    }
    return words.join('')
  }//m:ok, 2023-3-17




  ///////////////////////////////////////////////////
  function showTheseEl() {
    //show 1, some or all el except some?
    //in case it's button, we need to use el.style.display = 'none' instead of el.hidden

    /*  xe({  showTheseEl: [1 or some el names], ...a of string
              fromAllEl: [all el], ....el not s
              exceptEl: [el that except] ..el name / s
        })  
    */


    for (el of x.fromAllEl) {
      
      if (!x.exceptEl.includes(el.textContent.trim()) ) {
        //if the el not in x.exceptEl, run following
        
        if (x.showTheseEl.includes(el.textContent.trim() )) {
          //if matched, show
            el.style.display = 'block'
        } else {
          //not matched, hide
            el.style.display = 'none'
        }
      }
    }
  }//m:ok 2023-3-16




  ////////////////////////////////////////////////////////
  function cancelTimer() {
    // clear timer .... xe({ clearTimer:X1.message.timerName })

    if (x.cancelTimer) {
      clearTimeout(x.cancelTimer)  
    } else {
      return 'xdev: no timer to cancel'
    }
  }//m:ok, 2023-3-15




  //////////////////////////////////////////////// 
  function hideThis() {
    // hide el ........xe({ hideThis: el | '#id' })

    if (typeof x.hideThis == 'string') {
      document.querySelector(x.hideThis).hidden = true 
    } else if (x.hideThis instanceof HTMLElement) {
      x.hideThis.hidden = true 
    } else {
      return 'xdev/hideThis: invalid input'
    }
  }





  ///////////////////////////////////////////////////
  function showThis() {
    //show this or 1 el, with time setting
    /*  xe({  showThis: el, 
              forLong: 2000, ......mil sec
              timerName: 'aaaa' .....will use to cancel it 
          })
    */
    
    
    //check el
    if (x.showThis instanceof HTMLElement) {
      //already good
    } else if (typeof x.showThis == 'string') {
      x.showThis = document.querySelector(x.showThis)
    } else {
      //invalid
    }

    //show
    x.showThis.hidden = false

    //if x.forLong set hide it at the set timer, if no x.forLong just hang the show
    if (x.forLong > 0) {
      if (!x.timerName) x.timerName = '_xShowThis'
      
      this[x.timerName] = setTimeout( 
        () => x.showThis.hidden = true, 
        x.forLong  
      )

      //X1.message.timer = this[x.timerName] //keep timer v in X1
      xdev.timer = this[x.timerName]
    }
  }//m:ok, 2023-3-15





  //////////////////////////////////////////////////////
  function session(v) {
    //save x to sess in json, read json from sess and convert back to x
    /*  xe({ saveToSessionVar: '_obj', obj: x })
        xe({ readFromSessionVar: '_obj' })
    */

    if (v == 'save') {
      sessionStorage.setItem(
        x.saveToSessionVar, 
        JSON.stringify(x.obj) 
      )

    } else if (v == 'read') {
      return JSON.parse(
            sessionStorage.getItem(x.readFromSessionVar)
          )
    }//m:the read still not work, returning undefined
      
    else {
      //invalid
    }
  }//M:OK, 2023-3-22 

  


  ////////////////////////////////////////////////////
  function replaceClass() {
    //set color on text or background of el, or set of el

    /*  xe({  replaceClass: 'w3-black',
              with: 'w3-white',
              onEl: '#salesTab', //'#id' | el | [el,el,el]
          })
    */   
    

    if (typeof x.onEl == 'string') { //'#salesTab'
      x.onEl = document.querySelector(x.onEl)
    } 
    
    if (!Array.isArray(x.onEl) && x.onEl instanceof HTMLElement ) {
      //not array

      if (x.onEl.children.length) {
        //this el has children, set all children
        for (el of x.onEl.children) {
          if (el.classList.contains(x.with)) {
            //already the color to be set, don't touch
          } else if (el.classList.contains(x.replaceClass)) {
            //if have the color to be replaced, replace it
            el.classList.replace(x.replaceClass, x.with)
          } else {
            //don't have both, so add
            el.classList.add(x.with)
          }
        }

      } else {
        //has no child, so just set this one
        if (x.onEl.classList.contains(x.with)) {
          //do none, already has this class
        } else if (x.onEl.classList.contains(x.replaceClass)) {
          x.onEl.classList.replace(x.replaceClass, x.with)
        } else {
          x.onEl.classList.add(x.with)
        }
      }  

    } else {
      //here it is array so we will loop array & replace class

      if (x.onEl.length != 0) {
        for (el of x.onEl) {
          if (el.classList.contains(x.with)) {
            //already has that class, so ommit
          } else if (el.classList.contains(x.replaceClass)) {
            //has class to be replace, replace
            el.classList.replace(x.replaceClass, x.with)
          } else {
            //has no class to replace, so add new
            el.classList.add(x.with)
          }
        }
      }
    }
  }//m:ok mar13,2023
  //still simple mode




  /////////////////////////////////////////////
  function showEl() { 
    //show this el and hide the rest

    /*  xe({  showEl: el,
              hide:   'the rest',
              allEl:  [el1, el2, el3, el4, ...]
          })

        --if allEl supplied, the hide:'the rest' is automatic
    */
    
    //make all el ready
    if (typeof x.allEl[0] == 'string') {
      //the supplied allEl is string so make them el
      for (i=0; i < x.allEl.length; i++) {
        x.allEl[i] = document.querySelector(x.allEl[i])
      }
    } 

    //make el the actual el
    if (typeof x.showEl == 'string') {
      x.showEl = x_({el: x.showEl})
    }

    //show only the set el , the rest hide
    for (el of x.allEl) { 
      if (el == x.showEl) { 
        el.hidden = false
        el.style.display = 'block'
      } else {
        //these are the rests
        el.hidden = true 
        el.style.display = 'none'
      }
    }

  }//m:ok 2023-3-13
  //v0.1




  ////////////////////////////////////////////
  async function loadHtmlFile() { 
    //use w3.js to include html into section of the main html file. Also provide option for the loaded html to invoke init-code/f
    /*  xe({  loadHtmlFile: './sales-module.html',
              intoEl: '#salesModule',
              thenRun: thisFunction 
          })
    */


    if (x.loadHtmlFile && x.loadHtmlFile.includes('.html') && x.intoEl) {
      
      if (typeof x.intoEl == 'string') {
        document.querySelector(x.intoEl).setAttribute(
          'w3-include-html',
          x.loadHtmlFile
        )
      } else if (x.intoEl instanceof HTMLElement) {
        x.intoEl.setAttribute(
          'w3-include-html',
          x.loadHtmlFile
        )
      }
    }

    w3.includeHTML( () => {
      if (x.thenRun) {
        x.thenRun() //so keep the f in text which will unwrap here then it runs at the right time
      } else {
        //no f supplied
      }
    })

  }//m:ok 2023-3-13




  ////////////////////////////////////////////////////
  function createEl() {
    /*  create new el, set things and then attach to something

    { createEl: 'menu-item' , //both standard & custom el
      id: --,
      class: 'aaa bbb ccc',
      style: 'aaa:bbb; ccc:ddd; --',
      attriName: 'value', //can put many
      text: 'sssssssssssss',
      innerHtml: '<span>yo!</span> ................. ',
      appendTo: el

    */

    if (x.createEl) {
      let el = document.createElement(x.createEl)
      let keyList = Object.keys(x)

      for (i=1; i < keyList.length; i++) {

        if (keyList[i].match(/id|name|class|className|style|hidden|value|checked|disabled|src|href|text|textContent|innerHtml|innerHTML|appendTo|prependTo/)) {
         
          //standard or general attrib
          if (keyList[i] == 'id' && x.id) {
            el.id = x.id
          }
  
          if (keyList[i] == 'name' && x.name) {
            el.name = x.name 
          }
    
          if (keyList[i].match(/class|className/) && (x.class||x.className) ) {
            el.className = x.class? x.class : x.className 
          }
  
          if (keyList[i] == 'style' && x.style) {
            el.setAttribute('style',x.style)
          }
  
          if (keyList[i] == 'hidden' && x.hidden && typeof x.hidden == 'boolean') {
            el.hidden = x.hidden 
          }
  
          if (keyList[i] == 'value' && x.value) {
            el.value = x.value 
          }
          
          if (keyList[i] == 'checked' && x.checked && typeof x.checked == 'boolean') {
            el.checked = x.checked 
          }
  
          if (keyList[i] == 'disabled' && x.disabled && typeof x.disabled == 'boolean') {
            el.disabled = x.disabled 
          }
  
          if (keyList[i] == 'src' && x.src) {
            el.src = x.src 
          }
  
          if (keyList[i] == 'href' && x.href) {
            el.href = x.href 
          }
  
  
          if (keyList[i].match(/text|textContent/) && (x.text||x.textContent)) { 
            el.textContent = x.text? x.text : x.textContent 
          }
  
          if (keyList[i].match(/innerHtml|innerHTML/) && (x.innerHtml||x.innerHTML)) {
            el.innerHTML = x.innerHtml? x.innerHtml : x.innerHTML  
          }
  
  
  
          if (keyList[i] == 'appendTo' && x.appendTo) {
            if (typeof x.appendTo == 'string') {
              x.appendTo = document.querySelector(x.appendTo)
            } 
            //assumes at this point, the x.appendTo is good html el
            x.appendTo.append(el)
          }

          if (keyList[i] == 'prependTo' && x.prependTo) {
            if (typeof x.prependTo == 'string') {
              x.prependTo = document.querySelector(x.prependTo)
            }
            x.prependTo.prepend(el)
          }




        } else {
          //non-standard attrib, this block will regards the inputs as the attrib
          if (keyList[i]) {
            el.setAttribute(keyList[i],x[ keyList[i] ])
          }

        }
        
        
      }//for

      //if not put prepend or append just return the el
      if (!(x.appendTo || x.prependTo)) {
        return el 
      }
       
    }//if
    
  }



  ////////////////////////////////////////////////
  function jsid() {
    //gen random char at the digits required
    //x_({ccode:12}) ...gen 12 digits of random chars + 0-9 but the first digit cannot be number

    let code_ = ''
    for (d=0; d < x.jsid; d++) {
      if (d==0) {
        code_ = code_ + 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$'.charAt( Math.floor( Math.random() * 55 ))
      } else {
        code_ = code_ + 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$0123456789'.charAt( Math.floor( Math.random() * 65 ))
      }
      
    }
    return code_       
  }//M:ok 2023-4-8



  /////////////////////////////////////////////////
  function randomInt() {
    //gen random int from min to max
    // x_({randomInt:'20-60'})
    //if no range specified, just make it from 0-... like x_({randomInt:'100'}) is 0-100

    //default
    let min = 0; max = 100

    if (typeof x.randomInt == 'number') {
      //no range specified but put number
      max = x.randomInt
    } else if (x.randomInt.includes('-')) {
      let range = x.randomInt.split('-')
      min = Number(range[0])
      max = Number(range[1])
    } 
    //if put '' takes default which is 100 (max)
    
    return Math.floor(
      Math.random() * (max + 1 - min) + min  
    )
  }//M:ok 2023-4-8



  ///////////////////////////////////////////////////
  function password() {
    //gen passw at length desired
    // x_({password:48}) ...gen 48 char of passw

    if (x.password == '') x.password = 32
    let p = ''
    for (i=0; i < x.password; i++) {
      p = p + 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$!~%^&<>#@+-*/|[]{}()?:;,"='.charAt(
        Math.floor(
          Math.random() * 91 
        )
      )   
    }
    return p 
  }



}//end x_()
