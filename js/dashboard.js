const logged = localStorage.getItem("logged")
if(logged==null){
    window.location.replace("../index.html")
}
const email = localStorage.getItem("email")
const valid_email = email.replace(".", "")
async function setup(){
    const url = "https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"
    const email = localStorage.getItem("email")
    const f = await fetch(url+email+".json")
    if(await f.json()==null){
        alert("Account doesnt exist anymore!")
        localStorage.clear()
        return 
    }
    else{
        window.location.replace("./dashboard/index.html")
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
        a.append(text)
        const download_a = document.createElement("a")
        download_a.className = "right"
        const img = document.createElement("img")
        img.src = "../assets/download.png"
        download_a.append(img)
        download_a.id = file_num_now
        download_a.onclick = function(){
            download_file(this)
        }
        div.append(a)
        div.append(download_a)
        files_div.appendChild(div)
    }
}
show_files() 
async function download_file(b){
    const id = b.id 
    const arr = new Array()
    arr.push(id)
    console.log("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files/"+arr[0]+".json")
    const get = await fetch("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files/"+arr[0]+".json")
    const json = await get.json()
    const base_64 = json.file
    const type = json.type
    const blob = dataURItoBlob(base_64)
    const download = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = download
    a.download = json.name
    a.click()
    a.remove()
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