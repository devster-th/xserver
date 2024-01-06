// test .env file
require('dotenv').config()
console.log('masterKey=',process.env.masterKey)
console.log('masterSalt=',process.env.masterSalt)