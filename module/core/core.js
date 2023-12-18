global.coreInfo = {
  program:  'core module for xserver',
  version:  '0.1',
  staff:    ['M'],
  date:     '2023-12-14'
}

/* Each module in xserver platform will be a function which receiving input as an object, like:

  core({act:__, otherKeys:__})

The rule is no-rules. So the dev can set any form of object to communicate with his/her module but little recommendation for a common protocol among our ecosystem, we should have at least following format:

  moduleName(
    {
      act:___,
      module:___,

    }
  )

So at least we have these 2 keys. The module name will tell xserver which function to call. Another important thing is that we shouldn't have duplication of the moduleName so each module has to have a registration process which will be layed out later.  

*/

const xs = require('/home/sunsern/xserver/module/xdev/xdev.js')
const x$ = xs.x$ , mdb = xs.mdb
const {xc} = require('/home/sunsern/xserver/module/xdev/xcrypto.js')
const {xf} = require('/home/sunsern/xserver/module/xdev/xfile.js')
const {xd, DocControl} = require('/home/sunsern/xserver/module/xdev/xmongo.js')


exports.core = async function (v) {

  console.log('core', v)
  
  switch (v.act) {
    
    case 'info':
      return {
        moduleName:   'core',
        brief:        'the core of this xserver platform',
        version:      '0.1',
        by:           'nexWorld',
        releasedDate: '2023' 
      }
      break


    case 'log_in':
      /* input would be like
            {
              act:          'log_in', 
              username:     ___,
              passwordHash: ___
            }
      */

      let found = await xd({
        find: { username: v.username },
        from: 'user'
      })

      console.log(found)

      if (found.length) {
        //found username in xdb
        
        found = found[0]

        if (found.passwordHash == v.passwordHash) {
          //pass
          console.log('password correct')
  
          //now attach user.userId to xdb.session  
          xd({
            change: {sessionId: v.sessionId},
            with:   {userId:    found.userId},
            to:     'session'
          }) 

          let getContent = await xd({
            find: {state: 'pass'},
            from: 'xdb.content',
            getOnly: 'content'
          })
  
          return {
            act:      'log_in',
            pass:     true,
            content:  getContent[0].content
          }
  
  
        } else {
          //fail password
          console.log('wrong password')

          let getContent = await xd({
            find:     {state: 'wrong_password'},
            from:     'xdb.content',
            getOnly:  'content'
          })

          return {
            act:      'log_in',
            pass:     false,
            content:  getContent[0].content
          }
        }


      } else {
        //username not found

        console.log('not found this username in xdb')

        let getContent = await xd({
          find:     {state: 'wrong_username'},
          from:     'xdb.content',
          getOnly:  'content'
        })

        return {
          act:      'log_in',
          pass:     false,
          content:  getContent[0].content
        }
      }
      break




    case 'load_login_content':
      let contentFound = await xd({
        find: {act: 'load_login_content'},
        from: 'xdb.content'
      })

      if (contentFound.length) {
        return {
          act: 'load_login_content',
          content: contentFound[0].content
        }
      } else {
        return {
          act: 'load_login_content',
          error: "Not found."
        }
      }
      break


    case 'log_out':
      let re = await xd({
        change: {sessionId: v.sessionId},
        with:   {userId: ''},
        to:     'xdb.session'
      })

      console.log(re)

      return {
        act:      'log_out',
        sessionId: v.sessionId,
        success:  true
      }
      break



    case 'load_card':
      /* The data rights need to be set so each person may not see the same set of cards. The logged in user may sees cards that matched to her profile or search. But not-login user might see others. There're lots of things to be define & set. */

      // ! check if the mdb.load() will take from memory in case the doc is already there?
      return await mdb.load({
        find:'', from:'product'
      })
      break


    case 'add_justnote': 
      return await xd({
        add: {
          note: v.note,
          tag:  v.tag,
          by:   v.by
        },
        to: 'mutita.justNote'
      })
      break





    default:
      return {
        msg: "Invalid input.",
        fail: true,
        from: 'core.js',
      }
  }
  
  


}


/* 
2023-12-14
  -updated little on the top.
  -renamed the act:'request_product_cards' to 'load_card'
*/