var call=(select_obj)=> {
    var textArea = document.querySelector("#placeholder-signup");
    if (select_obj.value == "mentor") {
      textArea.style.display = "block";
    } else {
      textArea.style.display = "none";
    }
  }

  var showRow=(row)=>{
    let rid=Math.floor(Math.random() * 100); 
      let pop=document.getElementById("popup");
      let close=document.getElementById("close");
      row.onclick=function(){pop.style.display="flex";}
      close.onclick=function(){pop.style.display="none";}
      let x=row.cells;
      document.getElementById("sId").innerHTML=rid;
      document.getElementById("fname").innerHTML=x[0].innerHTML;
      document.getElementById("lname").innerHTML=x[1].innerHTML;
      document.getElementById("field").innerHTML=x[2].innerHTML;
        }