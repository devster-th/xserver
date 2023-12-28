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

    //-----------------------------------------------------------
    case 'log_in':
      /* input would be like
            {
              act:          'log_in', 
              username:     ___,
              passwordHash: ___
            }
      */

      let foundUser = await xd({
        find: { username: v.username },
        from: 'user'
      })

      console.log(foundUser)

      if (foundUser.length) {
        //found username in xdb
        
        foundUser = foundUser[0]

        //make passwordRealHash
        let realHash = await xs.passwordRealHash(
          v.username, v.passwordHash)

        if (foundUser.passwordHash == realHash) {
          //pass
          console.log('password correct')
  
          //now attach user.userId to xdb.session  
          xd({
            change: {sessionId: v.sessionId},
            with:   {userId:    foundUser.uuid},
            to:     'session'
          }) 
/*
          let getContent = await xd({
            find: {state: 'pass'},
            from: 'xdb.content',
            getOnly: 'content'
          })
*/  
          return {
            act:      'reply_log_in',
            done:     true,
            username: v.username,
            msg:      "Login done."
          }
  
  
        } else {
          //fail password
          console.log('wrong password')
/*
          let getContent = await xd({
            find:     {state: 'wrong_password'},
            from:     'xdb.content',
            getOnly:  'content'
          })
*/
          return {
            act:      'reply_log_in',
            done:     false,
            msg:      "Fail, wrong password."
          }
        }


      } else {
        //username not found

        console.log('not found this username in xdb')
/*
        let getContent = await xd({
          find:     {state: 'wrong_username'},
          from:     'xdb.content',
          getOnly:  'content'
        })
*/
        return {
          act:      'reply_log_in',
          done:     false,
          msg:      "Fail, username not found."
        }
      }
      break



    //------------------------------------------------------------
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
        to:     'session'
      })

      console.log(re)

      return {
        act:        'log_out',
        ref:        '',
        msg:        'Logout done.',
        sessionId:  v.sessionId,
        done:       true
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


    //------------------------------------------------------------
    case 'sign_up':
      // v = {act:'sign_up', username:___, passwordHash:___}

      //find db is there's duplicate
      let dup = await xd({
        find: {username: v.username} ,
        from: 'user'
      })

      if (dup[0]) {
        //reject & ask user to try new username
        return {
          act:  'reply_sign_up',
          ref:  '',
          done: false,
          msg:  'The specified username is already existed.'
        }
      } else {
        //good to go

        let newUser = await xd({
          add: {
            username:     v.username,
            passwordHash: await xs.passwordRealHash(
                            v.username, v.passwordHash
                          )
          },
          to: 'user'
        })

        if (newUser.insertedCount) {
          //now create directory & files
          let clear = !await xf({
            exist: `./website/user/${v.username}`
          })

          if (clear) {
            let doneMakeDir = await xf({
              makeDir:  `./website/user/${v.username}`
            })
            if (doneMakeDir) {
              let doneCopyIndexFile = await xf({
                copy: './website/index.html',
                to:   `./website/user/${v.username}/index.html`
              }) 
              if (doneCopyIndexFile) {
                let doneCopyConfFile = await xf({
                  copy: './website/config.js',
                  to:   `./website/user/${v.username}/config.js`
                })

                if (doneCopyConfFile) {
                  //now the homepage of new user is done, next to sign-in automatically
                  let newUserRecord = await xd({
                    find: {username: v.username},
                    from: 'user'
                  })

                  //attach new-user's uuid to the active session
                  if (newUserRecord[0]) {
                    let attachUserId = await xd({
                      change: {sessionId: v.sessionId},
                      with:   {userId: newUserRecord[0].uuid},
                      to:     'session'
                    })

                    //reply
                    if (attachUserId.modifiedCount) {
                      return {
                        act:        'reply_sign_up',
                        ref:        '',
                        done:       true,
                        newUsername: v.username,
                        newUserHome:`/user/${v.username}`,
                        msg:        "Sign-up done."
                      }
                    }
                  }
                 
                }
              }
            }
          } else {
            //something wrong the file with same name already existed
            console.log('directory not clear')
            return {
              act:  'reply_sign_up',
              ref:  '',
              done: false,
              msg:  "Problem with the file system."
            }
          }
        } else {
          //return error
          console.log('db problem')
          return {
            act:  'reply_sign_up',
            ref:  '',
            done: false,
            msg:  "Problem with the database."
          }
        }
      }
      break





    case 'forgot_password':
      break





    case 'save_story':
      //for testing the writer module
      let dbReply = await xd({
        add: v.data,
        to: 'test.story'
      })

      if (dbReply.insertedCount) {
        return {
          done: true,
          msg:  "The story saved."
        }
      } else {
        return {
          done: false,
          msg:  "Db error, the story not saved."
        }
      }
      break


    default:
      return {
        act:  'reply from core',
        msg:  "Wrong input.",
        done: false,
      }
  }
  
  


}


/* 
2023-12-14
  -updated little on the top.
  -renamed the act:'request_product_cards' to 'load_card'
*/