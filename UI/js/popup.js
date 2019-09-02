var call = select_obj => {
  var textArea = document.querySelector("#placeholder-signup");
  if (select_obj.value == "mentor") {
    textArea.style.display = "block";
  } else {
    textArea.style.display = "none";
  }
};

var showRow = row => {
  let rid = Math.floor(Math.random() * 100);
  let pop = document.getElementById("popup");
  let close = document.getElementById("close");
  row.onclick = function() {
    pop.style.display = "flex";
  };
  close.onclick = function() {
    pop.style.display = "none";
  };
  let x = row.cells;
  document.getElementById("sId").innerHTML = rid;
  document.getElementById("fname").innerHTML = x[0].innerHTML;
  document.getElementById("lname").innerHTML = x[1].innerHTML;
  document.getElementById("field").innerHTML = x[2].innerHTML;
};

var out = () => {
  let sesId = document.getElementById("SessionId").value;
  let mentId = document.getElementById("MentorId").value;
  let menteId = document.getElementById("MenteeId").value;
  let meEmail = document.getElementById("MenteeEmail").value;
  let qns = document.getElementById("question").value;
  let m = document.getElementById("view-pop");
  let close1 = document.getElementById("close1");
  m.style.display = "flex";
  close1.onclick = function() {
    m.style.display = "none";
  };
  document.getElementById("sessionid").innerHTML = sesId;
  document.getElementById("mentorid").innerHTML = mentId;
  document.getElementById("menteeid").innerHTML = menteId;
  document.getElementById("menteeemail").innerHTML = meEmail;
  document.getElementById("qn").innerHTML = qns;
};
var admin = row => {
  let pop = document.getElementById("popup");
  let close = document.getElementById("close");
  let x = row.cells;
  row.onclick = function() {
    if (x[3].innerHTML == "Mentor") {
      x[4].innerHTML = "Changed to user";
    } else {
      x[4].innerHTML = "Changed to mentor";
    }
  };
};
