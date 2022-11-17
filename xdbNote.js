//so find & edit can be mixed together
x={   find: {name:"john"}, 
      in: "people", 
      edit: {grade:"grade + 1"}    
  }


//the find can be complex
x={   find: { country:"thailand", sex:"male", 
              or_age:"< 60", 
              not_team:"A"    },
      in:"people",
      edit:{note:"these are good guys"}
  }


/*
sign: 
> ...มากกว่า
< ...น้อยกว่า
= ...เท่ากับ
! ...ไม่ใช่ ยกเว้น not, exclude
>= ...more than or equal
<= ...lesser or equal
*/


//EDIT 
x={   find: { goods:"salapao"},
      edit: { stock:"stock - 1"},
      in:"people"
  }
