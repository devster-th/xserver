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

function xe(x) {
  if (typeof x == 'object' && Object.keys(x).length > 0) {
    switch (Object.keys(x)[0]) {

      case 'showTheseEl':
        xShowTheseEl()
        break 
        // xe({ showTheseEl:[1 or some el], fromAllEl: [all el] })

      case 'cancelTimer': // xe({cancelTimer: X1.message.timerName})
        xCancelTimer() 
        break 

      case 'showThis': // xe({showThis:el, forLong:2000})
        xShowThis()
        break 

      case 'hideThis':
        xHideThis() // xe({ hideThis: el })
        break

      case 'saveToSessionVar':
        // xe({ saveToSessionVar: '_x', obj: x })
        xSession('save')
        break 

      case 'readFromSessionVar':
        // xe({ readFromSessionVar: '_x' })
        return xSession('read')
        break 

      case 'replaceClass': 
      // xe({replaceClass:'w3-black', with:'w3-white, onEl:el})
        xReplaceClass()
        break 

      case 'loadHtmlFile':
        xLoadHtmlFile()
        break

      case 'showEl':
        xShowEl()
        break 

      case 'create':
        xCreate()
        break

      case 'edit':
        xedit()
        break

      case 'delete':
        xdelete()
        break 

      default:
        return 'command not supported'
    }
  } else {
    return 'xdev: invalid command' 
  }
  

  ///////////////////////////////////////////////////
  function xShowTheseEl() {
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
  function xCancelTimer() {
    // clear timer .... xe({ clearTimer:X1.message.timerName })

    if (x.cancelTimer) {
      clearTimeout(x.cancelTimer)  
    } else {
      return 'xdev: no timer to cancel'
    }
  }//m:ok, 2023-3-15


  //////////////////////////////////////////////// 
  function xHideThis() {
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
  function xShowThis() {
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

      X1.message.timer = this[x.timerName] //keep timer v in X1

    }
  }//m:ok, 2023-3-15


 



  //////////////////////////////////////////////////////
  function xSession(v) {
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
  }

  
  ////////////////////////////////////////////////////
  function xReplaceClass() {
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
  function xShowEl() {
    //show this el and hide the rest

    /*  xe({  showEl: el,
              hide:   'the rest',
              allEl:  [el1, el2, el3, el4, ...]
          })

        --if allEl supplied, the hide:'the rest' is automatic
    */
    
    if (typeof x.allEl[0] == 'string') {
      //the supplied allEl is string so make them el
      for (i=0; i < x.allEl.length; i++) {
        x.allEl[i] = document.querySelector(x.allEl[i])
      }
    }

    for (el of x.allEl) {
      if (el == x.showEl) {
        el.hidden = false
      } else {
        //these are the rests
        el.hidden = true 
      }
    }

  }//m:ok 2023-3-13
  //v0.1


  ////////////////////////////////////////////
  async function xLoadHtmlFile() {
    //use w3.js to include html into section of the main html file. Also provide option for the loaded html to invoke init-code/f
    /*  xe({  loadHtmlFile: './sales-module.html',
              intoEl: '#salesModule',
              thenRun: thisFunction 
          })
    */

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

    w3.includeHTML( () => {
      if (x.thenRun) {
        x.thenRun() //so keep the f in text which will unwrap here then it runs at the right time
      } else {
        //no f supplied
      }
    })

  }//m:ok 2023-3-13


  ////////////////////////////////////////////////////
  function xCreate() {
    /*  
    { create: 'e' / ,
      el: 'p',
      id: --,
      class: 'aaa bbb ccc',
      style: 'aaa:bbb; ccc:ddd; --',
      attribute: 'aaa="bbb" ccc="ddd"',

    */

    if (x.create == 'el') {
      let el = document.createElement(x.el)
      if ('id' in x) {
        el.id = x.id
      }

    }
    
  }




}
