//convert xmongo commd to filter codes
let datas = [
  {name:'john', age:23, sex:'male'},
  {name:'jane', age:19, sex:'female'},
  {name:'dad', age:55, sex:'male'},
  {name:'mom', age:54, sex:'female'}
]
let quer = {name:'dad', OR_sex:'male', age:55}
let statem = ''
let count = 1

for (k in quer) {
  if (count == 1) {
    statem += `${k} == '${quer[k]}'`
  } else {
    if (k.match(/^OR_.+/)) {
      statem += ` || ${k.replace('OR_','')} == '${quer[k]}'`
    } else {
      statem += ` && ${k} == '${quer[k]}'`
    }
  }
  count++
} 

console.log(statem)