// convert csv to json
// name,age,sex 
// john,23,male
// jane,19,female
/* 
algorthm - splits lines first to get the headers and then loop each line. In each line, splits by ',' to get the data and fill those data to each label.
*/


function csv2obj(csv) {
  let ar = csv.split('\n')
  let obj = []
  let header = ar[0].split(',')
  let totalRow = ar.length - 1 //excludes header

  for (row=1; row <= totalRow; row++) {
    let thisRow = {}
    let data = ar[row].split(',')
    let i = 0 //loop data in each row

    header.forEach(h => {
      if (data[i]) {
        //has value
        if (data[i].match(/^\d+$/)) {
          //is number
          thisRow[h] = Number(data[i])
        } else {
          //not number
          thisRow[h] = data[i]
        }
      } else {
        //has no value
        thisRow[h] = ''
      }
      
      i++
    })

    obj.push(thisRow)
  }

  console.log(obj)
  //return obj
}


let csv = `name,age,sex,country
john,23,male
jane,19,female
sunsern,55,male
palika,54,female
putin,45212,don't know
biden,46546553,yeahhhhhhhhhhhhhh, 465465465465465
asdfasdf,asdfasdfasdf,asdfasdfasdf,asdfasdfasdf`

csv2obj(csv)



/* NOTE
everything works, 202311251917


*/