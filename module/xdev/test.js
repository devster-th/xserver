//test.js -- AES-GCM
/**
 * ok, tested both enc at node & dec at browser, and viseversa fine
 * m/20230516
 */

const xcrypto = require('./xcrypto')
//var crypto = require('crypto')


let msg = JSON.stringify(
  [
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
    { name:'mutita',
      age:55,
      sex:'male',
      living:'thailand'
    },
  ]
)

let key = 'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1'

//xcrypto.encrypt(msg,key).then(cx => console.log(cx))

let cx = 'a2DW7sRMX6ZPu3qWQx82hTvFnJ4K6SXpATKZ9+vWxUk3SkJh5CA6KVbHN75yWepq1/6i01+xRMTlbDotBO0iKGqBSkudZBjlu+OSMdOAE9WyQxjjg7GSMq39'

xcrypto.decrypt(cx,key).then(msg => console.log(msg))