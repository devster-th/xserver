function readForm(x) {
  let formData_ = {}
  for (el of x.elements) {
    if (el.type !="radio" && el.type !="checkbox") {
      formData_[el.name] = el.value
    } else {


      if (el.type =="radio") {
        //if the property not existed, create 1
        if (!formData_[el.name]) formData_[el.name] ="" 
        //if checked, put value in
        if (el.checked ==true) formData_[el.name] = el.value 
      } 

      if (el.type =="checkbox") {
        //if property not exist, create 1
        if (!formData_[el.name]) formData_[el.name] =""
        
        if (el.checked) {
          if (formData_[el.name] =="") { //if first value
            formData_[el.name] = el.value 
          } else { //if not first value
            formData_[el.name] = formData_[el.name] +","+ el.value 
          }
        }
      }

      //do more with other types of form inputs
      
    }
  }
  console.log(formData_)
}
//this func can move to be the {act:"readForm"} in the xDev