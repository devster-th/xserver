// xdb3.js
/**
 * make it more secure by each doc saved by each owner, and encrypted. Noone excepts the owner can read it. The admin can see structure of each db but not at the doc level.
 * 
 * xdb
 *  --room (room is db name), usually 1 room for an organization, or each team
 *    --box (box is collection of docs)
 *      --doc (each object)
 *        --data (key:value set of data)
 * 
 * EXAMPLE OF COMMAND
 * 
 * xdb({create: {
 *    dbName:
    *    collec1: [
    *       {
    *         name: 'text',
    *         'age: 'num',
    *         'sex': 'male/female/unspecified',
    *         ...
    *       },
    *    ],
    *    collec2: [...], 
    *     ...
 *    }
 *  }
 * })
 * 
 * 
 * 
 */

const fileManager = require('fs')



function xdb(inpu) {


}