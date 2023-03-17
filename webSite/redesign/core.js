//core.js
//the core of the entire app is here

//replace pagex with X1
function init() {

  globalThis.X1 = {
    activeMenu: 'Sales',
    activeTab: 'Home',
    menu: {
      menuitem: [
        {text: 'Sales', position:'', icon:'', section:'', run:''},
        {text: 'Marketing', position:'', icon:'', section:'', run:''},
        {text: 'Products', position:'', icon:'', section:'', run:''},
        {text: 'Warehouse', position:'', icon:'', section:'', run:''},
        {text: 'Delivery', position:'', icon:'', section:'', run:''},
        {text: 'Purchase', position:'', icon:'', section:'', run:''},
        {text: 'Finance', position:'', icon:'', section:'', run:''},
        {text: 'Accounting', position:'', icon:'', section:'', run:''},
        {text: 'Manufacturing', position:'', icon:'', section:'', run:''},
        {text: 'Maintenance', position:'', icon:'', section:'', run:''},
        {text: 'Assets', position:'', icon:'', section:'', run:''},
        {text: 'User setting', position:'', icon:'', section:'', run:''},
        {text: 'Admin', position:'', icon:'', section:'', run:''},
        {text: 'Learn', position:'', icon:'', section:'', run:''},
        {text: 'Log out', position:'', icon:'', section:'', run:''},
      ],
      sidebaritemClass: 'w3-bar-item w3-button',
      sidebarClass: 'w3-sidebar w3-grey w3-bar-block',
      mobileMenuClass: 'w3-grey w3-bar-block',
      mobileMenuitemClass: 'w3-bar-item w3-button w3-xlarge w3-border-bottom',
      defaultAction: 'menuAct(this)',
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

  //show menu based on user-rights
  xe({
    showTheseEl: X1.user.rights.module,
    fromAllEl: mobileMenuList,
    exceptEl: ['User setting','Admin','Learn']
  })

  xe({
    showTheseEl: X1.user.rights.module,
    fromAllEl: sidebarList,
    exceptEl: ['User setting','Admin','Learn']
  })

  menuAct('updateMenu') //first load sets to 'Sales' menu

}//end init() ....the core's init




// from this down, copied from index.html

////////////////////////////////////////////
function tabAct(el) {
  //when user click tab, change color that tab to white, the rest to black. And then show the tab-space, the rest hide

  //change color
  xe({  replaceClass: 'w3-white', 
        with: 'w3-black', 
        onEl: el.parentElement    })
  xe({  replaceClass: 'w3-black',
        with: 'w3-white',
        onEl: el                  })

  X1.activeTab = el.textContent //mem activeTab

  //right now not all module is open, so limit only few. More than these still don't do

  //show tab-space
  if (X1.activeMenu.match(/Sales|Marketing|Products/)) {

    xe({  showEl: this[ X1.activeMenu.toLowerCase() + 
      X1.activeTab] ,
      hide: 'the rest',
      allEl:  eval(`X1.module.${X1.activeMenu.toLowerCase()}.contentElList`)
      })
  }

  
    //allEl can be used a v like X1.module.sales.contentEl

  //savePageX()
}//m:ok


////////////////////////////////////////
function menuAct(el) {

  //1) MAKE ARRAY OF MENU ITEMS
  let mobileList = []
  for (l of mobileMenuBox.children) {
    if (l.textContent.trim().match(/Close|Log out/) ) {
    } else {
      mobileList.push(l)
    }
  }

  let sidebarList = []
  for (l of sidebar.children) {
    if (l.tagName == 'BUTTON' && l.textContent.trim() != 'Log out') {
      sidebarList.push(l)
    }
  }
  //m:ok


  //2) SET COLOR ON MENU
  if (el == 'updateMenu') {
    //update to get both menus active in the same item
    
    setActiveMenu(mobileList) 
    setActiveMenu(sidebarList)

  } else {
    //this is normal flow to get the click from user's selection
    let fromMenuBox = el.parentElement 
    X1.activeMenu = el.textContent.trim()
    setActiveMenu(mobileList) 
    setActiveMenu(sidebarList) 

    //if it's from mobileMenuBox, hide it after clicked
    if (fromMenuBox.id == 'mobileMenuBox') {
      mobileMenuBox.hidden = true
    }
  }//m:ok


  //3) LOAD & SHOW MODULE CONTENT, HIDE THE REST
  //execute each menu
  //new ver >> use xdev instead
  
  //if module content already loaded, not do, if not loaded, load
  if (
    eval(`X1.module.${X1.activeMenu.toLowerCase()}.moduleEl.innerHTML`)) {
      //already loaded, not load again
  } else {
    //still not load
    xe({
      loadHtmlFile: eval(`X1.module.${X1.activeMenu.toLowerCase()}.htmlFile`),
      intoEl: eval(`X1.module.${X1.activeMenu.toLowerCase()}.moduleEl`),
      thenRun: this['init' + X1.activeMenu]
    })
  }

  //show the active moduleEl, hide the rest
  let moduleEleList = []
  for (m of X1.assignedModule) {
    moduleEleList.push(
      eval(`X1.module.${m}.moduleEl`)
    )
  }

  xe({
    showEl: eval(`X1.module.${X1.activeMenu.toLowerCase()}.moduleEl`),
    allEl: moduleEleList 
  })




  function setActiveMenu(menuBoxToSet) {
    //change color of the menu

    //reset all menu's color
    xe({
      replaceClass: 'w3-light-grey',
      with: 'w3-grey',
      onEl: menuBoxToSet
    })

    //set color for the active menu
    for (l of menuBoxToSet) {
      if (l.textContent.trim() == X1.activeMenu) {
        xe({ 
          replaceClass:'w3-grey', 
          with:'w3-light-grey', 
          onEl: l 
        })
      }
    }
  }//m:ok

}//m:ok, 2023-3-15

/* use xdev.js instead

function savePageX() {
  //prevent data loss when user refresh browser
  sessionStorage.setItem('_pagex', JSON.stringify(pagex) )
}


function autoHide(el,millisec) {
  //auto hide the msg-box
  _autoHide = setTimeout( () => el.hidden = true, millisec)
}

function setColor(el,oldColor,newColor) {
  //change color class
  el.classList.replace(oldColor,newColor)
}



function xshow(el,time) {
  //show for a period then hide 

  if (typeof el == 'string') {
    //so user put string in
    el = document.querySelector(el)
    el.hidden = false 
  } else if (typeof el.hidden == 'boolean') {
    //this is html el
    el.hidden = false 
  } else {
    return false //bad input
  }

  //auto hide
  if (!time) {
    //if not set time, make default
    _autoHide = setTimeout(
      () => el.hidden = true, 2000  
    ) 
  } else if (time) {
    _autoHide = setTimeout(
      () => el.hidden = true, time 
    )
  } else if (time == 'stay') {
    //let it stay as long as it needs
  } else {
    return false //bad time input 
  }
}


function xhide(el) {
  if (typeof el == 'string') {
    document.querySelector(el).hidden = true 
  } else if (typeof el.hidden == 'boolean') {
    el.hidden = true 
  } else {
    return false //false input 
  }
}

function xcancel(autoV) {
  //clear auto task, e.g., xcancel(_autoHide)
  clearTimeout(autoV)
}



*/