//_config.js
//use for configuration of the app

const _conf = {
  
  module: { //all modules in the app
    sales: {
      htmlFile: './module/sales/sales.html',
      jsFile:   './module/sales/sales.js',
      initFunc: 'sales.init',
      menuName: 'sales',
      elid:     ''
    },
    marketing: {
      htmlFile: './module/marketing/marketing.html',
      jsFile:   './module/marketing/marketing.js',
      initFunc: 'marketing.init',
      menuName: 'marketing',
      elid:     ''
    },
    products: {
      htmlFile: './module/products/products.html',
      jsFile:   './module/products/products.js',
      initFunc: 'products.init',
      menuName: 'products',
      elid:     ''
    },
    delivery: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName: 'delivery'
    },
    warehouse: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName:'warehouse'
    },
    purchase: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName:'purchase'
    },
    finance: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName:'finance'
    },
    accounting: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName:'accounting'
    },
    manufacturing: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName:'manufacturing'
    },
    maintenance: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName: 'maintenance'
    },
    assets: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName: 'assets'
    },
    staff: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName: 'staff'
    },
    userSetting: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName: 'userSetting'
    },
    admin: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName: 'admin'
    },
    help: {
      htmlFile: '',
      jsFile:   '',
      initFunc: '',
      menuName: 'help'
    }
  },

  //////////////////////////////////////////////////////////
  menu: { //full menus available in the app
    sales: {
      text:     'Sales', 
      headicon: '', 
      tailicon: '', 
      module:   'sales' },
    marketing: {
      text:     'Marketing', 
      headicon: '', 
      tailicon: '', 
      module:   'marketing' },
    products: {
      text:     'Products', 
      headicon: '', 
      tailicon: '', 
      module:   'products' },
    delivery: {
      text:     'Delivery', 
      headicon: '', 
      tailicon: '', 
      module:   'delivery' },
    warehouse: {
      text:     'Warehouse', 
      headicon: '', 
      tailicon: '', 
      module:   'warehouse' },
    purchase: {
      text:     'Purchase', 
      headicon: '', 
      tailicon: '', 
      module:   'purchase' },
    finance: {
      text:     'Finance', 
      headicon: '', 
      tailicon: '', 
      module:   'finance' },
    accounting: {
      text:     'Accounting', 
      headicon: '', 
      tailicon: '', 
      module:   'accounting' },
    manufacturing: {
      text:     'Manufacturing', 
      headicon: '', 
      tailicon: '', 
      module:   'manufacturing' },
    maintenance: {
      text:     'Maintenance', 
      headicon: '', 
      tailicon: '', 
      module:   'maintenance' },
    assets: {
      text:     'Assets', 
      headicon: '', 
      tailicon: '', 
      module:   'assets' },
    staff: {
      text:     'Staff', 
      headicon: '', 
      tailicon: '', 
      module:   'staff' },
    userSetting: {
      text:     'User setting', 
      headicon: '', 
      tailicon: '', 
      module:   'userSetting' },
    admin: {
      text:     'Admin', 
      headicon: '', 
      tailicon: '', 
      module:   'admin' },
    help: {
      text:     'Help', 
      headicon: '', 
      tailicon: '', 
      module:   'help' },
    logout: {
      text:     'Log out', 
      headicon: '', 
      tailicon: '', 
      module:   'logout' },
  },

  //////////////////////////////////////////////////////////
  tag: { //special tags defined in this app, set classes & few here
    alert_icon: {
      class: 'fa fa-exclamation-circle w3-xlarge',
      style: 'color:red; cursor:pointer',
      attri: {}
    },
    login_space: { // convert _ to - and get the tagName
      class: 'w3-display-container',
      style: 'display:block',
      attri: {}
    },
    login: {
      class: 'w3-display-middle w3-display-container w3-large',
      style: 'width:350px',
      attri: {}
    },
    signup_space: {
      class: 'w3-container w3-large',
      style: '',
      attri: {}
    },
    control: {
      class: '',
      style: '',
      attri: {}
    },
    mobile_menu: {
      class: 'w3-grey w3-bar-block',
      style: 'width:60%; position:fixed; left:0; bottom:0; z-index:20',
      attri: {}
    },
    mobile_menu_icon: {
      class: 'fa fa-caret-right w3-left',
      style: 'font-size:28px; color:darkred; cursor:pointer; z-index:15; position:fixed; left:4px; top:50%',
      attri: {}
    },
    sidebar: {
      class: 'w3-sidebar w3-grey w3-bar-block',
      style: 'margin:0; padding:0',
      attri: {}
    },
    app_space: {
      class: 'w3-display-container',
      style: 'height:700px',
      attri: {}
    },
    bar: {
      class: 'w3-bar w3-margin-bottom w3-block',
      style: '',
      attri: {}
    },  
    module: {
      class: '',
      style: '',
      attri: {hidden:true}
    },
    tab: {
      class: 'w3-bar w3-black',
      style: '',
      attri: {}
    },
    workspace: {
      class: 'w3-block w3-display-container w3-container',
      style: '',
      attri: {hidden:true}
    },
    indicator_box: {
      class: 'w3-display-topright',
      style: 'margin-top:4px; margin-right:12px',
      attri: {}
    },
    ws_name: {
      get class() { //the text color will rotate every time called
        let c = this.colorCollec.shift()
        this.colorCollec.push(c)
        return 'w3-xlarge ' + c
      },
      style: '',
      attri: {},
      colorCollec: ['w3-text-blue','w3-text-green','w3-text-orange','w3-text-yellow','w3-text-pink','w3-text-brown']
    },
    box: {
      class: 'w3-row',
      style: '',
      attri: {}
    },  
    half: {
      class: 'w3-container w3-half',
      style: '',
      attri: {}
    },
    select: {
      class: 'w3-select',
      style: '',
      attri: {},
    },
    textarea: {
      class: 'w3-input w3-border',
      style: '',
      attri: {}
    },
    table: { //default table
      class: 'w3-table-all',
      style: '',
      attri: {}
    },  
    message_title: {
      class: 'w3-xlarge w3-margin-top w3-block',
      style: 'font-weight:bold',
      attri: {}
    },
    responsive: {
      class: 'w3-responsive',
      style: '',
      attri: {}
    },

    input: { // _conf.tag.input.text.class = ??? ....text is type
      text: {
        class: 'w3-input w3-border',
        style: '',
        attri: {}
      },
      number: {
        class: 'w3-input w3-border',
        style: '',
        attri: {}
      },
      email: {
        class: 'w3-input w3-border',
        style: '',
        attri: {}
      },
      password: {
        class: 'w3-input w3-border',
        style: '',
        attri: {}
      },
      checkbox: {
        class: 'w3-check',
        style: '',
        attri: {}
      },
      radio: {
        class: 'w3-radio',
        style: '',
        attri: {}
      },
     
    },

    button: { // _conf.tag.button.main.class = ??? ...main is _main attri
      main: {
        class: 'w3-button w3-blue',
        style: '',
        attri: {}
      },
      warn: {
        class: 'w3-button w3-yellow',
        style: '',
        attri: {}
      },
      alert: {
        class: 'w3-button w3-orange',
        style: '',
        attri: {}
      },
      danger: {
        class: 'w3-button w3-red',
        style: '',
        attri: {}
      },
      normal: { //default if _type not specified
        class: 'w3-button w3-border',
        style: '',
        attri: {}
      },
      tab: { //button in tab
        class: 'w3-bar-item w3-button w3-small',
        style: '',
        attri: {}
      },
      message: { //buton in the message box
        class: 'w3-button w3-light-grey',
        style: '',
        attri: {}
      },
      menu: {
        class: 'w3-bar-item w3-button w3-xlarge',
        style: '',
        attri: {}
      },
      sidebar: {
        class: 'w3-bar-item w3-button w3-large',
        style: '',
        attri: {}
      }
    },
  
    message_box: { //color of message-box based on _type="normal" ...
      normal: {
        class: 'w3-display-middle w3-card-4 w3-container w3-light-grey',
        style: 'width:65%; z-index:20',
        attri: {}
      },
      warn: {
        class: 'w3-display-middle w3-card-4 w3-container w3-yellow',
        style: 'width:65%; z-index:20',
        attri: {}
      },
      alert: {
        class: 'w3-display-middle w3-card-4 w3-container w3-orange',
        style: 'width:65%; z-index:20',
        attri: {}
      },
      danger: {
        class: 'w3-display-middle w3-card-4 w3-container w3-red',
        style: 'width:65%; z-index:20',
        attri: {}
      },
      success: {
        class: 'w3-display-middle w3-card-4 w3-container w3-green',
        style: 'width:65%; z-index:20',
        attri: {}
      },
      fail: {
        class: 'w3-display-middle w3-card-4 w3-container w3-orange',
        style: 'width:65%; z-index:20',
        attri: {}
      },
    },
    
  } // end tag
  
  
  
  
} //end _conf