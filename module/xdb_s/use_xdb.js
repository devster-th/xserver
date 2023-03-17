const xdb = require('./xdb_s')
const xfile = require('../xfile/xfile.js')

/*
xdb.$(
  {people:[
    {name:'voldermore'},
    {name:'snep'},
    {name:'harry'},
    {name:'hermiony'}
  ]}
)
*/

  
//xdb.$('(people.name:john).province=nakorn pathom; status=good').then(x => console.log(x))

/*
xdb.$({user: [
  {name:'shrake'},
  {name:'batman'},
  {name:'avatar'},
  {name:'ironman'}
]
}).then(
  xdb.$().then(x => console.log(x))
)
*/
/*
xdb.$({
  product:[
    {name:'noodle', price:30, stock:30, status:'active'},
    {name:'steak', price:300, stock:23, status:'active'},
    {name:'coffee', price:60, stock:5652, status:'inactive'},
    {name:'somtam', price:45, stock:652, status:'inactive'},

  ]
})
*/

  //xdb.$('(product).category=food').then(x => console.log(x))

  xdb.$('product.status:inactive').then(x => console.log(x))





//.then(x => console.log(3000, x))


//the then.() here is getting the undefined >>need to fix this