const logged = localStorage.getItem("logged")
const { createClient } = supabase
if(logged==null){
    window.location.replace("../index.html")
}
const email = localStorage.getItem("email")
const valid_email = email.replace(".", "")
async function setup(){
    const url = "https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"
    const email = localStorage.getItem("email")
    const valid_email = email.replace(".", "")
    const f = await fetch(url+valid_email+".json")
    if(await f.json()==null){
        alert("Account doesnt exist anymore!")
        localStorage.clear()
        window.location.replace("./index.html")
        return 
    }
}
setup()
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}

async function show_files(){
    const files_div = document.getElementById("files")
    const f = await fetch("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files.json")
    const json = await f.json()
    const app_div = document.createElement("div")
    for(let i =  0; i < json.num; i++){
        const file_num_now = i + 1 
        const f = await fetch("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files/"+file_num_now+".json")
        const json = await f.json()
        const file = json.name
        console.log(file)
        const div = document.createElement("div")
        div.style = "margin-top: 35px;"
        const a = document.createElement("a")

        const text = document.createTextNode(file)
        a.style = "cursor:pointer;"
        a.onclick = function(){
            get_url(json)
        }
        a.append(text)
        const download_a = document.createElement("a")
        download_a.className = "right"
        const img = document.createElement("img")
        img.src = "../assets/download.png"
        download_a.append(img)
        download_a.id = file_num_now
        download_a.onclick = function (){
            download_file(json)
        }
        div.append(a)
        div.append(download_a)
        app_div.append(div)
    }
    files_div.appendChild(app_div)
}
show_files() 
async function download_file(b){
    const _supabase = createClient('https://jupjgyhsopjypuwltlhd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cGpneWhzb3BqeXB1d2x0bGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDg2MDUsImV4cCI6MjAzOTU4NDYwNX0.y3NooSMu4rGYEytT8Yrb1tAV2XfQ9aGGC5IKZPWU8RU')
    const { data, error } = await _supabase
        .storage
        .from('files')
        .download(valid_email+"/"+b.name)
    if(error==null){
        console.log(data)
    }
    else{
        console.log(error)
        return
    }
        const win = window.URL.createObjectURL(data)
    window.open(win)
}
async function get_url(b){
    const top_header = document.getElementById("top-brand")
    top_header.innerHTML = "Url coppied to clipboard! stays valid for 24 hours!"
    const _supabase = createClient('https://jupjgyhsopjypuwltlhd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cGpneWhzb3BqeXB1d2x0bGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDg2MDUsImV4cCI6MjAzOTU4NDYwNX0.y3NooSMu4rGYEytT8Yrb1tAV2XfQ9aGGC5IKZPWU8RU')
    const { data, error } = await _supabase
        .storage
        .from('files')
        .createSignedUrl(valid_email+"/"+b.name, 86400)
    navigator.clipboard.writeText(data.signedUrl);
    setTimeout(() => {
        top_header.innerHTML = "Ptj-cloud"
    }, 4000);
}


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ia], {type:mimeString});
  }
