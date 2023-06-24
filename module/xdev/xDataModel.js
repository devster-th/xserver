//xDataModel.js 
/**
 * this file provides the classes for all data model using in the xApp
 */

const xs = require('./xdev1.js')


exports.ServerResponse = class {
  msg = ''
  from = '@xserver'
  success = ''
  id = ''
  time = new Date().toISOString()
}



exports.Devnote = class {

  title = '' //name or title of this thing
  noteNum = xs.uuidx() //timestamp with -12345 at the end
  by = '' //person who log this, e.g., m
  time = new Date
  type = '' //idea,note,bug,issue ...whatever
  msg = '' //explain what it is
  project = '' 
  module = ''
  function = ''
  codeBlock = ''
  app = ''
  db = ''

  comment = [] 
  status = 'new' //new, working, solving, done, cancel
  statusNote = ''
  lastUpdate = ''
  tag = ''
  category = ''

  //getter for internal use
  get info() {
    return "Use this model to log any issue of the dev works whether it is: idea, note, bug, status, etc."
  }

  get validity() {
    return {
      logNum:'required;autoGen;func:xs.uuidx;>8',
      by:'required',
      time:'required;autoGen;func:Date',
      msg:'required',
      status:'required;[new|working|solving|done|cancel]'
    }
  }

  get description() {
    return {
      title: "name or title of this thing",
      logNum: "timestamp with -12345 at the end.",
      by: "person who log this, e.g., M",
      time: "new Date",
      type: "idea,note,bug,issue ...whatever",
      msg:"explain what it is",
      project:"Put what project or assignment/task you working on.", 
      module:"Module that involved.",
      function:"Function involved.",
      codeBlock:"Code block involved.",
      app:"App involved.",
      db:"Db involved.",
      comment:"This is comment array.",
      status:"Status of this log, starting with 'new' but can be one of:new, working, solving, done, cancel.",
      statusNote:"Status such as active,solved,cancel, whatever.",
      lastUpdate:"Time of last udpate.",
      tag:"Tag if any.",
      category:"Category if any."
    }
  }

  get subModel() {
    //if there's sub model inside this model put them here as obj

    return {

      comment:{
        by:'',
        msg:'',
        time: new Date 
      },
      //more subModel follows
    } 
  }


}//devnote



exports.GeneralNote = class {
  //general & very simple note
  
  note = ''
  tag = ''
  by = ''
  time = new Date

}




exports.Product = class {

  name = 'a'
  price = 0
  stock = 0
  partNum = 'human rememberable code'
  note = 'short note about this product'
  count = 0
  availableDate = new Date()
  tax = 'tax that applies'
  star = 0
  rate = 'rating of this product'
  UOM = 'piece'
  availableMarket = ['Thailand','Global']
  brand = 'the brand'
  brief = 'this is highlight of the product'
  currency = 'THB'
  dangerLevel = 1
  description = "this is long description of the product. Treat this as official description of the product."
  guarantee = '1 year'
  leadTime = 20
  origin = 'Thailand'
  producer = 'the producer'
  returnable = true 
  terms = 'any'
  promoLongDays = 30
  promoStartDate = new Date
  promotion = 'promotion name if any'
  accounting = {debit:'debit account code',credit:'debit account code'}
  internationalCode = xs.uuid()
  transaction = ['put transaction object in this array']
  lastUpdate = new Date

  _model = {
    note: "use this as standard for all products in xdb",
    version: '1.0',
    org: 'mutita.org'
  }
  

}


exports.Customer = class {

  name = ''
  lastname = ''
  username = ''
  prefix = ''
  sex = ''
  birthday = ''
  
  address = {
    street: '',
    village: '',
    district: '',
    city: '',
    province: '',
    country: '',
    postalCode: ''
  }

  tel = ''
  email = ''
  facebook = ''
  twitter = ''

  career = ''
  organization = ''

  height = ''
  weight = ''
  eyeColor = ''
  skinColor = ''

  colorPreference = ''
  clothStylePreference = ''
  spendPerOrder = ''
  BuyChannelPreference = ''

  customerid = xs.uuid()

  signedUpTime = ''
  status = 'active'
  note = ''
}


exports.Order = class {

  date = new Date
  orderNum = xs.uuidx()
  customerid = ''
  product = []
  orderTerms = ''
  delivery = {
    leadTime:0,
    address:''
  }
  status = 'new'
  createdBy = ''

  get info() {
    return "Data model for order."
  }

  get validity() {
    return {
      orderNum:'uuidx;required',
      product:'required;subModel:product',
      createdBy:'required;userid'
    }
  }

  get description() {

  }

  get subModel() {
    return {
      product: {
        id:'', 
        qty:'',
        UOM:'',
        unitPrice:'',
        totalPrice:'',
        pricing:'',
        terms:'',
        special:'',
        delivery:'',
        currency:'' 
      }
    }
  }
}