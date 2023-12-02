/**
 * core.js is the main program of the app/software.
 * version: 0.1
 * license: none
 * date: 2023-06-13
 * web:''
 * contact: mutita.org@gmail.com
 * 
 * @param {object} X - can have various properties  
 * @returns {object} - output of the work
 * 
 * note: the X is actually the packet.msg
 */

/*  #use
          const core = require('./core.js')
          core.$({do:'something', ...})

      --change
          const {core} = require(...)
          core({
            act: =processName=,
            //data for this action
          })
*/




exports.core = async function (X) {

  console.log('core', X)
  
  switch (X.act) {
    
    case 'info':
      return {
        moduleName: 'core',
        brief:      'the core of this xserver platform',
        version:    '0.1',
        by:         'nexWorld',
        releasedDate: '2023' 
      }
      break


    case 'log_in':
      /* input would be like
            {act:'log_in, username: , passwordHash: }
      */

      let found = await xd({
        find: { username: X.username },
        from: 'xdb.user'
      })

      console.log(found)

      if (found.length) {
        //found username in xdb
        
        found = found[0]

        if (found.passwordHash == X.passwordHash) {
          //pass
          console.log('password correct')
  
          //now attach user.userId to xdb.session  
          xd({
            change: {sessionId: X.sessionId},
            with:   {userId: found.userId},
            to:     'xdb.session'
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
        change: {sessionId: X.sessionId},
        with:   {userId: ''},
        to:     'xdb.session'
      })

      console.log(re)

      return {
        act:      'log_out',
        sessionId: X.sessionId,
        success:  true
      }
      break



    case 'request_product_cards':
      return await xd({
        find:'', from:'xdb.product'
      })
      break


    case 'add_justnote': 
      return await xd({
        add: {
          note: X.note,
          tag:  X.tag,
          by:   X.by
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
