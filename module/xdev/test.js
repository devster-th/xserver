//test.js 
/**
 * use this file to test anything on xdev
 */

//const xcrypto = require('./xcrypto')
//var crypto = require('crypto')
const xs = require('./xdev1.js')
const xmongo = require('./xmongo.js')
const {ObjectId} = require('mongodb') 
const model = require('./xDataModel.js')

//<el xs="get:name age, from:xdb.customer, filter:{age:50-}"


//xs.$({get:'all',from:'xdb.product'}).then(
//  x => console.log(x)
//)


async function newOrder() {

  xs.$({
    set: {
      date: new Date,
      orderNum: xs.uuidx(),
      customer: await xs.$({get:'_id', from:'xdb.customer', filter:{name:'jane'}}),
      product: await xs.$({get:'_id', from:'xdb.product', filter:{name:'coffee'}}),
      qty: 56,
      terms: "unknow",
      deliveryPlace:"mid of the sea",
      status:'active'
    },
    to: 'xdb.order'
  }).then(
    xs.$({
      get:'',
      from:'xdb.order'
    }).then(x => console.log(x))
  )

}

//newOrder()

async function testSet() {


    xs.$({
      set:{
        internalCode: xs.uuid()
      },
      to:'xdb.product',
      filter: {} 
    }).then( re => {
      console.log(re)

        xs.$({
          get:'name internalCode',
          from:'xdb.product',
          //filter:{_id:'647c284b6c590377e9371290'}, //partNum:'F100'}, //, //'*', //{price:'100+'} //,
          order:{name:'a>z'}
        }).then(re => console.log(re))

    }
    
  )
  
  
}


//test filling db 1/1
async function test1by1() {
  for (i=1; i <= 8; i++) {
    await xs.$({
      set:{price: xs.randomInt(100,1000)},
      to:'xdb.product',
      filter:{count: i }
    })
  }

  console.log(
    await xs.$({
      get:'name stock price', from:'xdb.product'
    })
  )
}



async function testGet() {
  console.log(
    
    await xs.$({
      get:"xdb.order{orderNum:/96562/}"
      //get:'xdb.product.6476ceecf01f0d7ff6a69a26',
      //from:'xdb.product',
      //filter:{_id:"647d30c7ea9fd00cdd19367d"} ,
      //order:{star:'des'}
    }) 

    /*
    await xmongo.find(ObjectId('647d30c7ea9fd00cdd19367d'),'product','xdb')

    //ok
    */

  )
}
//testGet()

/*
console.log(
  xs.isHex("647ca62b606827bsa2cda5e3f")
  //xs.jparse('{"name":"john"}')
  //xs.jsonify({name:'john'})
)
*/


async function xmon() {
  xdb.increase(
    {stock:10},
    {name:'coffee'},
    'product',
    'xdb'
  ).then(
    console.log(
      await xdb.find({name:'coffee'},'product','xdb')
    )
    
  )
}

async function xsInc() {
  xs.$({
    dbIncrease:{price:-100},
    query:{name:'cake'},
    col:'product',
    db:'xdb'

  }).then(
    console.log(
      await xs.$({get:'',from:'xdb.product',filter:{name:'cake'} })

    )
  )
}//ok


async function testCreateDb() {
  xs.$({newDb:'aaaa'}).then(
    xs.$({newCol:'xxxx',db:'aaaa'})
  ).then(
    xs.$({newCol:'yyyy',db:'aaaa'})
  )
}//ok


function testXid() {
  console.log(
    new ObjectId("647c287e6c590377e9371291")
  )
}



function testFilter(fil) {
  // test $or ---------------------------------------
  //filter:{a:1 ,b:2 ,or_c:3 ,d:4 ,or_e:5 }
  //will group every or_ into the same $or:[...]

  /*
  let fil = {
    a:1000, b:2000, or_c:3000, //d:4000, 

  }
*/



  let key = Object.keys(fil)
  console.log(key)


  //check
  if (key.length == 1 && key[0].match(/^or_.+$/) ) {
    //this is like .... fil = {or_a:1000} ...that's it
    //will just take the or_ out and let it be a simple 1 key filter
    key = [ key[0].replace('or_','') ]
    fil = {[ key[0] ]: fil[ Object.keys(fil)[0] ] }
  }





  //rearrange by putting all the or_ to the right
  //from ['aaa','or_bbb','ccc','or_ddd'] 
  //to ['aaa','ccc','or_bbb','or_ddd']

  let justKey = []
  let or_key = []

  for (i=0; i < key.length; i++) {
    if ( key[i].match(/^or_.+$/) ) {
      or_key.push( key[i] )
    } else {
      justKey.push( key[i] ) 
    }
  } 

  key = justKey.concat(or_key)

  console.log(key)

  //marking the or_key


  let or_table = []

  for (i=0; i < key.length; i++) {
    
    if (key[i].match(/^or_.+$/)) {
      
      or_table[i] = true //mark or_

    } else {
      or_table[i] = ''
    }

  }

  console.log(or_table) // true means there's or_ mark

  if (or_table.length == 2 && !or_table[0] && or_table[1]) {
    // ['', true] ...this is $or:[{A},{B}]
    or_table[0] = true 
  }

  //making $or object

  let newFil = {}

  for (i=0; i < or_table.length; i++) {

    if (or_table[i] && !newFil.$or) { 
      //first or_
      newFil.$or = [ 
        { [ key[i].replace('or_','') ]: fil[ key[i] ] }
      ]
    
    } else if (or_table[i] && newFil.$or) {
      //following or_
      newFil.$or.push(
        {[ key[i].replace('or_','') ]: fil[ key[i] ]}
      ) 
    
    } else {
      // not or_ , just add as new property of the newFil
      newFil[ key[i] ] = fil[ key[i] ]
    }

  } 

  console.log(newFil)
}


/**
 * program here is gernally worked, ok, m/20230608
 */



//----------------------------------
//testGet()
//testSet()
//test1by1()

/*
xs.$({
  set:{
    stock:'10%', price:'10%', leadTime:'10%'
  }, 
  //special:true, //allows to put special option into the set  
  to:'xdb.product', 
  filter:{name:'nood*'} 

}).then( re => {
  console.log(re)   

  xs.$({
    get:'', 
    from:'xdb.product', 
    filter:{partNum:'f*'},
    order:{name:'a>z'}
  }).then(x=>console.log(x))  /*
})




//xmon()
//xsInc()

//testCreateDb()
//testXid()

/*
testFilter(
  //{name:'jack', or_sex:'xxx', or_age:52,   } 
  {$or:[
    {$and:[{xyz:111},{abc:4545}]},
    {xyz:555}
  ]}
)
*/

/*
console.log(
  xs.randomInt(0,200)
)
*/

// test creating new product from model Product
/*
let newp = new Product
newp.name = 'Bicycle'
newp.brand = 'CA, Thailand'
newp.producer = 'CA Bicycle Co., Ltd.'
newp.brief = 'A bicycle that you can ride everytime you want.'
newp.price = 8000
newp.star = 5 

xs.$({
  set: newp,
  to:'xdb.product'
}).then( 

  xs.$({

    get:'', 
    from:'xdb.product', 
    filter:{specialCode:'04e252ffe0d7737c2e64b2d5ccea8fd0'}
    //filter:{internalCode:'49c4124c-0089-4408-a7f0-60c21585d0c5'}
  
  }).then(x => console.log(x))
//)



//new customer from model
/*
let newcus = new model.Customer 
newcus.name = 'Jack Ma'
newcus.address.country = 'China'
newcus.organization = 'Alibaba Inc'
newcus.sex = 'male'
newcus.prefix = 'Mr.'
newcus.note = "this is good guy"

xs.$({set:newcus, to:'xdb.customer'}).then(
  xs.$({get:'', from:'xdb.customer', filter:{name:/jack/i}}).then(x => console.log(x))
)
*/

/*
let n = [/nood/,/ga prao/,/coffee/,/tom/,/cake/,/pen/,/cup/,/fried/,/bicycle/i]

async function testSetMany() {
  n.forEach(
    nn => {
      xs.$({
        set: {specialCode: xs.random() }, 
        to:'xdb.product', 
        filter:{name: nn}
      })
    }
  )
}

/*
testSetMany().then(x => {
  
  xs.$({get:'specialCode',from:'xdb.product'}).then(x => console.log(x))
})


function clog(v) {
  return console.log(v)
}

/*
xs.$({  get:'',
        from:'xdb.customer',
        filter:{name:'j*'}
    }).then(x => clog(x))

*/

/*
for (i=0; i<=10; i++) {
  console.log(
    xs.random()
  )
}
*/

/*
console.log(
  xs.$({
    xcert:'thailand',
    key:'mutita'
  }).then(s => {
    console.log(s)
    
    xs.$({
      xcert:'thailand',
      key:'mutita',
      sig: s
    }).then(v => console.log(v))
  })
)

*/


async function testDocCount() {
  console.log(
    await xmongo.docCount({UOM:/cup/},'product','xdb')
  )
}
//testDocCount()


async function testDistinct() {
  console.log(
    await xmongo.distinct(
      'organization',
      {},
      'customer',
      'xdb'
    )
  )
}
//testDistinct()



//new order
async function newor() {
  let newor = new model.Order
  newor.createdBy = await xs.$({get:'userid', from:'xdb.customer', filter:{name:'mutita'}})
  
  newor.customerid = await xs.$({get:'customerid',from:'xdb.customer',filter:{name:'john'}})

  newor.product[0].id = await xs.$({get:'specialCode',from:'xdb.product',filter:{name:/fried/}})

  xs.$({set:newor, to:'xdb.order'}).then(re => {
    console.log(re)

    xs.$({get:'',from:'xdb.order'}).then(x => console.log(x))
  })
}

//newor()


async function dist() {

  xs.$({
    get:{distinct:'status'},
    from:'xdb.order'
  }).then(x => console.log(x))
}//ok
//dist()


async function count() {

  xs.$({
    get:'_docQty',
    from:'xdb.product',
    filter:{brand:/ye/i}
  }).then(x => console.log(x))
}//ok
//count()

/**
 * the get has no problem with the ObjectId or _id in the filter
 * but the set has, cannot use both
 * 
 * ! can't get internalCode, m/20230609
 * 
 */