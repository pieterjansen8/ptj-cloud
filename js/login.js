const url = "https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"
const { createClient } = supabase

function hash(string) {
    var str = CryptoJS.SHA256(string)
    var to_str =str.toString()
    return to_str
}
function setup(){
    const logged = localStorage.getItem("logged")
    if(logged=='true'){
        get_in_acc()
    }
    const div = document.createElement("div")
    div.innerHTML = '    <dialog id="news" open>'+
    '    <article>'+
    '      <header>'+
    '        <button aria-label="Close" rel="prev" onclick="remove_dialog()"></button>'+
    '        <p>'+
    '          <strong>📰</strong>'+
    '        </p>'+
    '      </header>'+
    '      <p>'+
    '        ❌im sorry to announce that all accounts are removed.'+
    '      </p>'+
    '      <ul>'+
    '        <li>❓ some account were corrupted and were unable to upload files.</li>'+
    '        <li>✅ All services are succesfully up again and working!</li>'+
    '        <li>🗄️Status: Everything is UP⬆️</li>'
    '      </ul>'+
    '    </article>'+
    '  </dialog>'
    window.document.body.append(div)
}
setup()
async function get_acc(){
    const email = document.getElementById("email").value
    const hashed_mail = hash(email) 
    const valid_email = hashed_mail.replace(".", "")
    const req = await fetch(url+valid_email+".json")
    const json = await req.json()
    if(json==null){
        return false
    }
    else{
        return true
    }
}

async function login(){
    const acc_exist = await get_acc()
    const password = document.getElementById("password").value 
    const email = document.getElementById("email").value
    const hashed_mail = hash(email) 
    const valid_email = hashed_mail.replace(".", "")
    const password_hashed = hash(password)
    if(acc_exist==true){
        const req = await fetch(url+valid_email+".json")
        const json = await req.json()
        if(json.password==password_hashed){
            localStorage.setItem("email", hashed_mail)
            localStorage.setItem("password", password)
            localStorage.setItem("logged", true)
            get_in_acc()
        }
        else{
            alert("ERROR Wrong password!")
            return
        }
    }
    console.log(API_back)
    const _supabase = createClient('https://jupjgyhsopjypuwltlhd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cGpneWhzb3BqeXB1d2x0bGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDg2MDUsImV4cCI6MjAzOTU4NDYwNX0.y3NooSMu4rGYEytT8Yrb1tAV2XfQ9aGGC5IKZPWU8RU')
    const { data, error } = await _supabase.storage.from('files').upload(valid_email+'/welcome.txt', {
        cacheControl: '3600',
        upsert: false
      })
    if(error==null){

    }
    else{
        console.log(error)
        return
    }
    const body = JSON.stringify({
        "password": password_hashed, 
        "files":{
            "num":0 
        }
    }) 
    const put = await fetch(url+valid_email+".json",{
        headers:{
            'Accept': 'application/json',
            'Content-Type': "application/json",
        },
        method: "PATCH",
        body: body
    })
    localStorage.setItem("email", hashed_mail)
    localStorage.setItem("password", password)
    localStorage.setItem("logged", true)
    get_in_acc()
}
async function get_in_acc(){
    const email = localStorage.getItem("email")
    const valid_email = email.replace(".", "")
    const f = await fetch(url+valid_email+".json")
    if(await f.json()==null){
        alert("Account doesnt exist anymore!")
        localStorage.clear()
        return 
    }
    else{
        window.location.replace("../dashboard/index.html")
    }
}
function remove_dialog(){
    const doc = document.getElementById("news"); doc.remove()
}