//_config.js
//use for configuration of the app

const _conf = {
  
  module: { //all modules in the app
    sales: {
      htmlFile: '/module/sales/sales.html',
      jsFile:   '/module/sales/sales.js',
      initFunc: 'sales.init',
      menuid:   'sales',
      elid:     'sales_module'
    },
    marketing: {
      htmlFile: '/module/marketing/marketing.html',
      jsFile:   '/module/marketing/marketing.js',
      initFunc: 'marketing.init',
      menuid:   'marketing',
      elid:     'marketing_module'
    },
    products: {
      htmlFile: '/module/products/products.html',
      jsFile:   '/module/products/products.js',
      initFunc: 'products.init',
      menuid:   'products',
      elid:     'products_module'
    },
    delivery: {
      htmlFile: '/module/delivery/delivery.html',
      jsFile:   '/module/delivery/delivery.js',
      initFunc: 'delivery.init',
      menuid:   'delivery'
    },
    warehouse: {
      htmlFile: '/module/warehouse/warehouse.html',
      jsFile:   '/module/warehouse/warehouse.js',
      initFunc: 'warehouse.init',
      menuid:   'warehouse'
    },
    purchase: {
      htmlFile: '/module/purchase/purchase.html',
      jsFile:   '/module/purchase/purchase.js',
      initFunc: 'purchase.init',
      menuid:   'purchase'
    },
    finance: {
      htmlFile: '/module/finance/finance.html',
      jsFile:   '/module/finance/finance.js',
      initFunc: 'finance.init',
      menuid:   'finance'
    },
    accounting: {
      htmlFile: '/module/accounting/accounting.html',
      jsFile:   '/module/accounting/accounting.js',
      initFunc: 'accounting.init',
      menuid:   'accounting'
    },
    manufacturing: {
      htmlFile: '/module/manufacturing/manufacturing.html',
      jsFile:   '/module/manufacturing/manufacturing.js',
      initFunc: 'manufacturing.init',
      menuid:   'manufacturing'
    },
    maintenance: {
      htmlFile: '/module/maintenance/maintenance.html',
      jsFile:   '/module/maintenance/maintenance.js',
      initFunc: 'maintenance.init',
      menuid:   'maintenance'
    },
    assets: {
      htmlFile: '/module/assets/assets.html',
      jsFile:   '/module/assets/assets.js',
      initFunc: 'assets.init',
      menuid:   'assets'
    },
    staff: {
      htmlFile: '/module/staff/staff.html',
      jsFile:   '/module/staff/staff.js',
      initFunc: 'staff.init',
      menuid:   'staff'
    },
    userSetting: {
      htmlFile: '/module/user_setting/user-setting.html',
      jsFile:   '/module/user_setting/userSetting.js',
      initFunc: 'userSetting.init',
      menuid:   'usersetting'
    },
    admin: {
      htmlFile: '/module/admin/admin.html',
      jsFile:   '/module/admin/admin.js',
      initFunc: 'admin.init',
      menuid:   'admin'
    },
    help: {
      htmlFile: '/module/help/help.html',
      jsFile:   '/module/help/help.js',
      initFunc: 'help.init',
      menuid:   'help'
    }
  },
  menu: { //full menus available in the app
    sales: {
      text:'Sales', 
      headicon:'', 
      tailicon:'', 
      module:'sales' },
    marketing: {
      text:'Marketing', 
      headicon:'', 
      tailicon:'', 
      module:'marketing' },
    products: {
      text:'Products', 
      headicon:'', 
      tailicon:'', 
      module:'products' },
    delivery: {
      text:'Delivery', 
      headicon:'', 
      tailicon:'', 
      module:'delivery' },
    warehouse: {
      text:'Warehouse', 
      headicon:'', 
      tailicon:'', 
      module:'warehouse' },
    purchase: {
      text:'Purchase', 
      headicon:'', 
      tailicon:'', 
      module:'purchase' },
    finance: {
      text:'Finance', 
      headicon:'', 
      tailicon:'', 
      module:'finance' },
    accounting: {
      text:'Accounting', 
      headicon:'', 
      tailicon:'', 
      module:'accounting' },
    manufacturing: {
      text:'Manufacturing', 
      headicon:'', 
      tailicon:'', 
      module:'manufacturing' },
    maintenance: {
      text:'Maintenance', 
      headicon:'', 
      tailicon:'', 
      module:'maintenance' },
    assets: {
      text:'Assets', 
      headicon:'', 
      tailicon:'', 
      module:'assets' },
    staff: {
      text:'Staff', 
      headicon:'', 
      tailicon:'', 
      module:'staff' },
    usersetting: {
      text:'User setting', 
      headicon:'', 
      tailicon:'', 
      module:'userSetting' },
    admin: {
      text:'Admin', 
      headicon:'', 
      tailicon:'', 
      module:'admin' },
    help: {
      text:'Help', 
      headicon:'', 
      tailicon:'', 
      module:'help' },
    logout: {
      text:'Log out', 
      headicon:'', 
      tailicon:'', 
      module:'logout' },
  },
  tag: { //special tags defined in this app, set classes & few here
    login_space: { // convert _ to - and get the tagName
      class: 'w3-display-middle',
      style: 'display:block',
      attri: {}
    },
    login: {
      class: 'w3-display-middle w3-display-container w3-large',
      style: 'width:400px',
      attri: {}
    },
    signup_space: {
      class: 'w3-container w3-large',
      style: '',
      attri: {hidden:true}
    },
    control: {
      class: '',
      style: '',
      attri: {hidden:true}
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
      attri: {hidden:true}
    },
    message_box: {
      class: 'w3-display-middle w3-yellow w3-card-4 w3-container',
      style: 'width:65%; z-index:20',
      attri: {}
    },
    message_title: {
      class: 'w3-xlarge',
      style: '',
      attri: {}
    },
    act_bar: {
      class: 'w3-bar w3-margin-bottom',
      style: '',
      attri: {}
    },  
    module: {
      class: '',
      style: '',
      attri: {hidden:true}
    },
    conf: {
      class: '',
      style: '',
      attri: {}
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
    indicator: {
      class: 'w3-display-topright',
      style: 'margin-top:4px; margin-right:12px',
      attri: {}
    },
    ws_name: {
      class: 'w3-xlarge w3-text-brown',
      style: '',
      attri: {},
      textColorCollec: ['w3-text-brown','w3-text-blue','w3-text-green','w3-text-orange','w3-text-yellow','w3-text-pink']
    },
    block: {
      class: 'w3-row',
      style: '',
      attri: {}
    },  
    column: {
      class: 'w3-container w3-half',
      style: '',
      attri: {}
    },
    /*
    input: { // _conf.tag.input.text.class = ??? ....text is type
      text: {
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
      }
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
      danger: {
        class: 'w3-button w3-orange',
        style: '',
        attri: {}
      },
      default: {
        class: 'w3-button w3-border',
        style: '',
        attri: {}
      },
      tab: {
        class: 'w3-bar-item w3-button w3-small'
      }
    },
    table: { //default table
      class: 'w3-table-all',
      style: '',
      attri: {}
    }  
    */
  },
  message: { //color of message-box
    default: {
      class: 'w3-light-grey',
      style: '',
      attri: {}
    },
    warn: {
      class: 'w3-yellow',
      style: '',
      attri: {}
    },
    danger: {
      class: 'w3-orange',
      style: '',
      attri: {}
    }
  } 
  
} //end _conf