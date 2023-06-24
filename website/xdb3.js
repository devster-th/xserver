//xdb3.js
/* this version will make everything in the object called xdb. So it actually an object, and everyhting works in there.*/

/* command:
  xdb.init()        initialize
  xdb.status        show db status/info 
  xdb.new = {...}   put new data
  xdb.data          get whole data
  xdb.find('*')     all data

  xdb.find({customer:'*'})    gets all customer data
  xdb.find({ customer:'j', country:'thai', grossOrder:'>1000' })
  xdb.find({
    products:'car', model:'ssss', status:'new', type:'NOT_truck'
  })

  xdb.update({
    customer:{cat:'people, name:'j', status:'=good' }
  })
  

*/

const xdb = {
  data: [],

  get read() {
    return this.data 
  },

  set new(x) {
    x._id = this.id()
    this.data.push(x)
  },

  id() {
    const c1 = Date.now()
    let id = Date.now()
    while (id==c1) {
      id = Date.now()
    }
    return id
  },

  find(x) {
    //xdb.find({cat:'goods',name:'nood'}) ... this is & logic
    //x = {cat:'goods', name:'j'}
    // xdb.data.filter(d => d.cat.match('people') && ..)

    let cmd = '' //make the search command in this v

    //loop through all x.keys
    for (key of Object.keys(x)) {

      if (key.match(/^OR_/)) {
        // OR_age:23 
        console.log('or case')

      } else if (key.match(/^NOT_/)) {
        // NOT_cat:'goods'
        console.log('not case')

      } else {
        //no special prefix, or says it is && logic between each keys

        let compare = x[key]?.toString().match(/([<=>]+)?(.+)/)

        if (compare[1]) {
          // age:'>60' , should apply for digit value only not words
          cmd = (cmd?cmd+' && ':'') + `d.${key}?.toString() ${compare[1]} ${compare[2]}` //d.age? < 50
  
        } else {
          //no comparison
          cmd = (cmd?cmd+' && ':'') + `d.${key}?.toString().toLowerCase().match('${x[key].toString().toLowerCase()}')`
  
        }
      }
      
    }
    return xdb.data.filter(d => eval(cmd))

  }, //now multi key & comparison search work


  //working
  update() {
    // xdb.update({cat:'goods',name:'noodle',stock:=500})
    for (key of Object.keys(x)) {

    }
  }







}//end xdb