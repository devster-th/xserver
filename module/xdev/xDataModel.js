//xDataModel.js 
/**
 * this file provides the classes for all data model using in the xApp
 */

const xs = require('./xdev1.js')

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