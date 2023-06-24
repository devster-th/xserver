//core.js
//the core of the entire app is here

var core = {}

//replace pagex with X1
core.init = function () { 

  globalThis.X1 = {
    activeMenu: 'Sales',
    activeTab: 'Home',
    menu: {
      item: [
        {text: 'Sales', position:1, icon:'', section:'', run:''},
        {text: 'Marketing', position:2, icon:'', section:'', run:''},
        {text: 'Products', position:3, icon:'', section:'', run:''},
        {text: 'Warehouse', position:4, icon:'', section:'', run:''},
        {text: 'Delivery', position:5, icon:'', section:'', run:''},
        {text: 'Purchase', position:6, icon:'', section:'', run:''},
        {text: 'Finance', position:7, icon:'', section:'', run:''},
        {text: 'Accounting', position:8, icon:'', section:'', run:''},
        {text: 'Manufacturing', position:9, icon:'', section:'', run:''},
        {text: 'Maintenance', position:10, icon:'', section:'', run:''},
        {text: 'Assets', position:11, icon:'', section:'', run:''},
      ],
      defaultitem:[
        {text:'User setting', position:16, icon:'', section:'', run:''},
        {text:'Admin', position:17, icon:'', section:'', run:''},
        {text:'Learn', position:18, icon:'', section:'', run:''},
        {text:'Log out', position:19, icon:'', section:'', run:''},
      ],
      sidebaritemClass: 'w3-bar-item w3-button',
      sidebarClass: 'w3-sidebar w3-grey w3-bar-block',
      mobileMenuClass: 'w3-grey w3-bar-block',
      mobileMenuitemClass: 'w3-bar-item w3-button w3-xlarge w3-border-bottom',
      defaultAction: 'core.menuAct(this)',
    },
    module: {
      sales: {
        moduleEl: salesModule,
        htmlFile: './module/sales-module.html',
        tabList: ['Home','Report','Customer','Quotation'],
        firstActiveTab: 'Home',
        contentElList: ['#salesHome', '#salesReport', '#salesCustomer', '#salesQuotation']
      },
      marketing: {
        moduleEl: marketingModule,
        htmlFile: './module/marketing-module.html',
        tabList: [],
        firstActiveTab: '',
        contentElList: []
      },
      products: {
        moduleEl: productsModule,
        htmlFile: './module/products-module.html',
        tabList: ['Home','Setting','Report'],
        firstActiveTab: 'Report',
        contentElList: ['#productsHome', '#productsSetting', '#productsReport']
      }
    },
    assignedModule: ['sales','marketing','products'],
    message: {
      el: messageBox,
      timer: ''
    },
    color: {
      menu: {
        unselectedBackground: 'w3-grey',
        selectedBackground: 'w3-light-grey'
      },
      tab: {
        unselectedBackground: 'w3-black',
        selectedBackground: 'w3-white'
      },
      spaceTitle: ['w3-text-brown','w3-text-blue','w3-text-green','w3-text-orange'],
      message: {
        button: {
          unselectedBackground: 'w3-light-grey',
          selectedBackground: 'w3-grey'
        }
        
      }
    },
    user: {
      accessid: x_({genXuuid:1}),
      rights: {
        module: ['Sales','Marketing','Products','Warehouse','Delivery','Purchase','Finance','Accounting','Manufacturing','Maintenance','Assets']
      },
      roles: ['user','admin','businessAdmin','superUser']
    },
    language: {
      english: {},
      thai: {},
      japanese: {},
      french: {}
    }
  
  }//end of X1



  //check & set user-rights and affect to menu
  let mobileMenuList = [] 
  for (l of mobileMenuBox.children) {
    if (!l.textContent.trim().match(/Close|Log out/) ) {
      mobileMenuList.push(l)
    }
  }

  let sidebarList = []
  for (l of sidebar.children) {
    if (l.textContent.trim() != 'Log out' && l.tagName == 'BUTTON') {
      sidebarList.push(l)
    }
  } 

  //show menu based on user-rights, so not all user see the full menus
  x_({
    showTheseEl: X1.user.rights.module,
    fromAllEl: mobileMenuList,
    exceptEl: ['User setting','Admin','Learn']
  })

  x_({
    showTheseEl: X1.user.rights.module,
    fromAllEl: sidebarList,
    exceptEl: ['User setting','Admin','Learn']
  })

  core.menuAct('updateMenu') //first load sets to 'Sales' menu

  //test module template
  x_({
    loadHtmlFile:'./module/template/module-template.html',
    intoEl:'module#test_module'
  })


}//end init() ....the core's init




// from this down, copied from index.html

////////////////////////////////////////////
core.tabAct = function (el) { 
  //when user click tab, change color that tab to white, the rest to black. And then show the selected workspace, the rest hide

  //make real el
  if (typeof el == 'string') {
    el = x_({el: el})
  }

  //change color
  x_({  replaceClass: 'w3-white', 
        with: 'w3-black', 
        onEl: el.parentElement    })
  x_({  replaceClass: 'w3-black',
        with: 'w3-white',
        onEl: el                  })

  sales.activeSpace = el.getAttribute('_space') //mem activeTab

  //right now not all module is open, so limit only few. More than these still don't do

  //make list of workspace
  let spaceList = x_({el:'module[name="' + core.activeMenu + '"]>workspace'}) 

  //show workspace
  x_({  showEl: 'module[name="' + core.activeMenu + 
                '"]>workspace[name="' + el.getAttribute('_space') + 
                '"]' , 
        hide:   'the rest',
        allEl:  spaceList 
    })
  //allEl can be used a v like X1.module.sales.contentEl

  //savePageX()
}//m:ok



////////////////////////////////////////
core.menuAct = function (el) { 
  //act on menu click
  //console.log('core.manuAct()', el)

  if (typeof el == 'string') {
    el = x_({el: el}) //make it a good el not just like '#elid'
  }

  //1) MAKE ARRAY OF MENU ITEMS
  let mobileList = []
  for (l of x_({el:'mobile-menu'}).children) {
    if (l.id.match(/close|logout/) ) {
      //skip
    } else {
      mobileList.push(l)
    }
  }

  let sidebarList = []
  for (l of x_({el:'sidebar'}).children) {
    if (l.tagName == 'BUTTON' && l.id != 'logout') {
      sidebarList.push(l)
    }
  }
  //m:ok


  //2) HIGHLIGHT THE ACTIVE MENU
  if (el == 'updateMenu') {
    //update to get both menus active in the same item
    
    setActiveMenu(mobileList) 
    setActiveMenu(sidebarList)

  } else {
    //this is normal flow to get the click from user's selection
    let fromMenuBox = el.parentElement 
    core.activeMenu = el.name //takeout _menu & _sidebar
    setActiveMenu(mobileList) 
    setActiveMenu(sidebarList) 

    //if it's from mobileMenuBox, hide it after clicked
    if (fromMenuBox.tagName == 'MOBILE-MENU') {
      x_({el:'mobile-menu'}).hidden = true
    }
  }//m:ok


  //3) LOAD & SHOW MODULE CONTENT, HIDE THE REST
  //execute each menu
  //new ver >> use xdev instead
  
  //if module content already loaded, not do, if not loaded, load
  try {
    if ( x_({el:'module[name="' + core.activeMenu + '"]'}) ) {
        //already loaded, not load again
    } else {
      //still not load
      let newPlug = document.createElement('plug')
      x_({el:'app-space'}).append(newPlug)

      x_({
        loadHtmlFile: _conf.module[core.activeMenu].htmlFile ,
        intoEl: newPlug ,
        thenRun: core.startModule
        //'core.dressTag("#" + _conf.module[core.activeMenu].elid)'
        //_conf.module[core.activeMenu].initFunc // sales.init
      })//M:ok230331
    }
  } catch {
    console.log('! menuAct/something wrong in the load module content')
  }//now loads html success
  
  //dress tags in newly loaded el
  //core.dressTag('#' + _conf.module[core.activeMenu].elid)

  //show the active moduleEl, hide the rest
  let moduleEleList = x_({el:'app-space module'})
  

  try {
    x_({
      showEl: 'module[name="' + core.activeMenu + '"]',
      allEl: moduleEleList 
    })
  } catch {
    console.log('! menuAct/something wrong in the show module content')
  }//M:ok 2023-3-31
  


    ////////////////////////////////////////////////
    function setActiveMenu(menuBoxToSet) {
      //change color of the menu

      //reset all menu's color
      x_({
        replaceClass: 'w3-light-grey',
        with: 'w3-grey',
        onEl: menuBoxToSet
      })

      //set color for the active menu
      for (l of menuBoxToSet) {
        if (l.name == core.activeMenu) {
          x_({ 
            replaceClass:'w3-grey', 
            with:'w3-light-grey', 
            onEl: l 
          })
        }
      }
    }//M:ok 2023-3-31

}//m:ok, 2023-3-15


///////////////////////////////////////////////////////
core.passCheck = function (ev) {
  //work on password coming from this el
  core.password = btoa( atob(core.password) + ev.data )
  password.value = password.value.replace(/.$/,'*')
}//M:ok 2023-3-29


//////////////////////////////////////////////////////
core.login = function () {
  //process v from login_form
  //console.log(core.username, core.password )

  if (!core.username) { //for testing
    if (username.value) {
      core.username = username.value
    }
  }

  if (core.username == 'mutita' && core.password == 'dGhhaWxhbmQ=') {
    //test u=mutita, p=thailand
    //after login=ok, open the home_space

    x_({el:'login-space'}).style.display = 'none'
    x_({el:'login-space'}).hidden = true 
    //x_({el:'sidebar'}).style.display = 'none'
    //x_({el:'sidebar'}).hidden = true

    //open control & app-space
    x_({el:'control'}).style.display = 'block'
    x_({el:'control'}).hidden = false 
    x_({el:'app-space'}).style.display = 'block'
    x_({el:'app-space'}).hidden = false 



    //init v get from server
    core.loggedin = true 
    core.sessionid = Date.now()
    core.initModule = 'sales'
    core.assignedModule = ['sales','marketing','products','delivery','warehouse','purchase','finance','accounting','manufacturing','maintenance','assets','staff','userSetting','admin','help']

    core.makeMenu()

    //press on menu based on the core.initModule
    core.menuAct( 'mobile-menu>button[name="' + core.initModule + '"]' )

    //the codes above this made the width of sidebar changed, so fix by below
    core.displayCheck()






  } else {
    alert('invalid login')
  }
}//M:ok 2023-3-29


/////////////////////////////////////////////////////
core.signup = function () {
  x_({el:'login-space'}).style.display = 'none'
  x_({el:'signup-space'}).style.display = 'block'
  x_({el:'signup-space'}).hidden = false 

}


////////////////////////////////////////////////////
core.makeMenu = function() {
  //make menu from core.assignedModule

  if (core.assignedModule) {
    let count = 0 //use to add w3-border-top
    let mobileLoopDone = false 

    for (mo of core.assignedModule) {
      count++
      mobileLoopDone = false

      //make mobile menu
      x_({  createEl:'button',
            name: _conf.module[mo].menuName, //sales_menu
            text: _conf.menu[ _conf.module[mo].menuName ].text ,
            class: _conf.tag.button.menu.class + drawLine(),
            onclick: 'core.menuAct(this)',
            appendTo: x_({el:'mobile-menu'})
      })
      mobileLoopDone = true 

      //make sidebar
      x_({  createEl:'button',
            name: _conf.module[mo].menuName, //sales_sidebar
            text: _conf.menu[ _conf.module[mo].menuName ].text ,
            class: _conf.tag.button.sidebar.class + drawLine(),
            onclick: 'core.menuAct(this)',
            appendTo: x_({el:'sidebar'})
      })
    }

    //make logout menu
    x_({  createEl:'button',
          name: 'logout',
          text: _conf.menu.logout.text ,
          class: _conf.tag.button.menu.class + ' w3-border-top',
          onclick: 'core.menuAct(this)',
          appendTo: x_({el:'mobile-menu'})
    })

    x_({  createEl:'button',
          name: 'logout',
          text: _conf.menu.logout.text ,
          class: _conf.tag.button.sidebar.class + ' w3-border-top',
          onclick: 'core.menuAct(this)',
          appendTo: x_({el:'sidebar'})
    })

    


    //-------------------------------------------
    function drawLine() {
      //draw line every 4 menu items
      if (count==5 || count==9 || count==13) {
        return ' w3-border-top'
      } else {
        return ''
      }
    }
  }    
}//M:ok 2023-3-31


///////////////////////////////////////////////////////
core.displayCheck = function () {
  //onresize checks state of all displays
  console.log('core.displayCheck()')

  //seems @media not work so do here
  if (core.loggedin) {
    if (innerWidth < 1000) {
      x_({el:'message-box'}).style.width = '65%'
      x_({el:'mobile-menu-icon'}).style.display = 'block'
    }
    if (innerWidth >= 1000) {
      x_({el:'mobile-menu-icon'}).style.display = 'none'
      x_({el:'sidebar'}).style.width = '15%'
      x_({el:'message-box'}).style.width = '45%'
    }
    if (innerWidth >= 1300) {
      x_({el:'sidebar'}).style.width = '10%'
      x_({el:'message-box'}).style.width = '30%'

    }
    
  }

  //check height for all workspaces
  x_({el:'login-space'}).style.height = innerHeight + 'px'
  x_({el:'signup-space'}).style.height = innerHeight + 'px'
  x_({el:'app-space'}).style.height = innerHeight + 'px'

  
}//M:ok 23-4-1 worked, solved problem of the sidebar width mismatched with the app-space's margin-left


////////////////////////////////////////////////////////
core.dressTag = function (el) {
  //set classes, attri everything to the tags esp. the special tags
  //el can be 1 or many el that needs to dress


  if (typeof el == 'string') {
    el = x_({el: el})
  } 

  //not do on button & rest yet
  for (each of el.querySelectorAll('*')) { //

    let t = each.tagName.toLowerCase().replaceAll('-','_')

    if (t in _conf.tag  && !each.hasAttribute('_nodress')) {

      //all tags have no conditions, 1 leyer, just set it
      if (_conf.tag[t].class) {
        each.className = (each.classList.value=='')? 
          _conf.tag[t].class : 
          each.classList.value + ' ' + _conf.tag[t].class

        if (each.getAttribute('style')) {
          each.setAttribute(
            'style',
            each.getAttribute('style') + _conf.tag[t].style
          )
        } else {
          each.setAttribute('style', _conf.tag[t].style)
        }

        if (Object.keys(_conf.tag[t].attri !='')) {
          for (a in _conf.tag[t].attri) {
            each.setAttribute(a, _conf.tag[t].attri[a])
          }
        }

      //input
      } else if (t == 'input') {
        each.className = (each.classList.value)?
          each.classList.value + _conf.tag[t][each.type].class :  
            _conf.tag[t][each.type].class
        
        if (each.getAttribute('style')) {
          each.setAttribute(
            'style',
            each.getAttribute('style') + _conf.tag[t][each.type].style
          )
        } else {
          each.setAttribute('style', _conf.tag[t][each.type].style)
        } 

        if (Object.keys(_conf.tag[t][each.type].attri !='')) {
          for (a in _conf.tag[t][each.type].attri) {
            each.setAttribute(a, _conf.tag[t][each.type].attri[a])
          }
        }

      //general button
      } else if (t == 'button' 
                  && each.parentElement.tagName != 'TAB'
                  && !each.closest('message-box')) {

        let ty = each.getAttribute('_type')
        if (!ty) ty = 'normal'

        each.className = (each.classList.value)?
          each.classList.value + ' ' + _conf.tag.button[ty].class :
          _conf.tag.button[ty].class
      
        if (each.getAttribute('style')) {
          each.setAttribute(
            'style',
            each.getAttribute('style') + _conf.tag[t][ty].style
          )
        } else {
          each.setAttribute('style', _conf.tag[t][ty].style)
        }

        if (Object.keys(_conf.tag[t][ty].attri !='')) {
          for (a in _conf.tag[t][ty].attri) {
            each.setAttribute(a, _conf.tag[t][ty].attri[a])
          }
        }

      //button in tab
      } else if (t == 'button' 
                  && each.parentElement.tagName == 'TAB') {
        each.className = (each.classList.value)?
          each.classList.value + ' ' + _conf.tag.button.tab.class :
            _conf.tag.button.tab.class

        if (each.getAttribute('style')) {
          each.setAttribute(
            'style',
            each.getAttribute('style') + _conf.tag.button.tab.style
          ) 
        } else {
          each.setAttribute('style', _conf.tag.button.tab.style)
        }

        if (Object.keys(_conf.tag.button.tab.attri !='')) {
          for (a in _conf.tag.button.tab.attri) {
            each.setAttribute(a, _conf.tag.button.tab.attri[a])
          }
        }


      //button in message-box
      } else if (t == 'button'
                  && each.closest('message-box')) {
        each.className = (each.classList.value=='')?
          _conf.tag.button.message.class :
          each.classList.value + ' ' + _conf.tag.button.message.class
      
        if (each.getAttribute('style')) {
          each.setAttribute(
            'style',
            each.getAttribute('style') + _conf.tag.button.message.style
          )
        } else {
          each.setAttribute('style', _conf.tag.button.message.style)
        }

        if (Object.keys(_conf.tag.button.message.attri !='')) {
          for (a in _conf.tag.button.message.attri) {
            each.setAttribute(a, _conf.tag.button.message.attri[a])
          }
        }

      //message-box
      } else if (t == 'message_box') {
        let ty = each.getAttribute('_type')

        each.className = (each.classList.value)?
          each.classList.value + ' ' + _conf.tag.message_box[ty].class :
            _conf.tag.message_box[ty].class

        if (each.getAttribute('style')) {
          each.setAttribute(
            'style', 
            each.getAttribute('style') + _conf.tag.message_box[ty].style
          )
        } else {
          each.setAttribute('style', _conf.tag.message_box[ty].style)
        }
        
        if (Object.keys(_conf.tag.message_box[ty].attri !='')) {
          for (a in _conf.tag.message_box[ty].attri) {
            each.setAttribute(a, _conf.tag.message_box[ty].attri[a])
          }
        }
      }
       
    }
  }


} //M:ok 23-4-2 ; M:ok 23-4-13


//////////////////////////////////////////////////////
core.startModule = function () {
  //in menuAct after load the module's html then run this f

  //dress all tags with classes, styles, etc.
  core.dressTag(
    'module[name="' + core.activeMenu + '"]' //'module[name="sales"]'
  )

  //run the first-tab /workspace
  core.tabAct(
    'module[name="' + core.activeMenu + '"]>tab>button[_first-tab]'
  )

  //run the init f of the module if any
  let hasStartFunc = _conf.module[core.activeMenu].initFunc 

  if (hasStartFunc) {
    eval(hasStartFunc)()
  } else {
    //skip
  }
      


}//M:ok 23-4-2