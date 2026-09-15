const API = "http://localhost:8080/api";
let token = localStorage.getItem("token");

function authHeaders(){
  return {"Content-Type":"application/json","Authorization":"Bearer "+token};
}

async function login(){
  const res=await fetch(API+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email:email.value,password:password.value})});
  const data=await res.json().catch(()=>null);
  if(!res.ok){authMsg.textContent=data||"Login failed";return;}
  token=data.token; localStorage.setItem("token",token);
  auth.style.display="none"; app.style.display="block"; welcome.textContent=`Welcome, ${data.name} (${data.role})`;
  loadDoctors(); loadAppointments();
}

async function register(){
  const res=await fetch(API+"/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name:regName.value,email:regEmail.value,password:regPass.value,role:"PATIENT"})});
  const data=await res.text(); authMsg.textContent=data;
}

async function loadDoctors(){
  const q=specialization.value.trim();
  const res=await fetch(API+"/doctors"+(q?"?specialization="+encodeURIComponent(q):""));
  const data=await res.json();
  doctors.innerHTML=data.map(d=>`<div class="doctor">
    <b>ID ${d.id}: ${d.name}</b><br>${d.specialization}<br>
    ${d.qualification||""}<br>Days: ${d.availableDays||"N/A"} | Time: ${d.availableTime||"N/A"}
    <button onclick="doctorId.value=${d.id}">Select</button>
  </div>`).join("");
}

async function book(){
  const res=await fetch(API+"/appointments",{method:"POST",headers:authHeaders(),
    body:JSON.stringify({doctorId:Number(doctorId.value),appointmentDate:date.value,
      appointmentTime:time.value,reason:reason.value})});
  const data=await res.json().catch(()=>null);
  bookMsg.textContent=res.ok?"Appointment booked successfully!":(data||"Booking failed");
  if(res.ok) loadAppointments();
}

async function loadAppointments(){
  if(!token)return;
  const res=await fetch(API+"/appointments/my",{headers:authHeaders()});
  if(!res.ok)return;
  const data=await res.json();
  appointments.innerHTML=data.length?data.map(a=>`<div class="appointment">
    <b>${a.doctor.name}</b> — ${a.doctor.specialization}<br>
    ${a.appointmentDate} at ${a.appointmentTime}<br>Status: <b>${a.status}</b><br>${a.reason||""}
    ${a.status==="BOOKED"?`<button onclick="cancelAppointment(${a.id})">Cancel</button>`:""}
  </div>`).join(""):"No appointments yet.";
}

async function cancelAppointment(id){
  await fetch(API+"/appointments/"+id+"/cancel",{method:"PUT",headers:authHeaders()});
  loadAppointments();
}

function logout(){
  localStorage.removeItem("token"); token=null; location.reload();
}

if(token){auth.style.display="none";app.style.display="block";loadDoctors();loadAppointments();}
