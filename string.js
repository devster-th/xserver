// string.js

let goods = {
    price: "> 1000"
}

let split = goods.price.split(" ")

if (split[1].match(/\D/g) == null) { //if it pure digit?

    //if null, it is all dijit then convert to number
    split[1] = Number(split[1])
    goods.price = split //save back to the obj
}

console.log(goods)

