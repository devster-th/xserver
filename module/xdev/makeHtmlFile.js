//test pull data from db and write to file on html codes.

const xs = require('./xdev1.js')
const $ = xs.$

run()

async function run() {
  let data = await $({get:'quotation{docNum:/54981/}'})
  data = data[0]

  let content = 
`<!DOCTYPE html>
<body>
<h1>Quotation #${data.docNum.slice(-5)}</h1>
<span>Status: ${data.docStatus}</span><br>

<p>Date: ${data.docDate}<br>
Document number: ${data.docNum}</p>`

  $({ 
      fileWrite: content, 
      fileName: '/home/mutita/dev/xserver/website/doc/' + data._id.toString() + '.html'
  })

}
