const email = localStorage.getItem("email")
const valid_email = email.replace(".", "")
const { createClient } = supabase
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}

async function upload(){
    const div = document.getElementById("upload_div")
    const new_div = document.createElement("div")
    new_div.id = "new_div"
    div.appendChild(new_div)
    new_div.innerHTML = "<button type='submit' class='secondary' onclick='real_upload()'>Upload</button>"
}
async function real_upload(){
    const nw = document.getElementById("new_div")
    nw.innerHTML = "<progress />"
    const file = document.getElementById("file").files[0]
    if(file.size>52428800){
        alert("Error, file is to big!")
        window.location.reload()
        return
    }
    const _supabase = createClient('https://jupjgyhsopjypuwltlhd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cGpneWhzb3BqeXB1d2x0bGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDg2MDUsImV4cCI6MjAzOTU4NDYwNX0.y3NooSMu4rGYEytT8Yrb1tAV2XfQ9aGGC5IKZPWU8RU')
    const { data, error } = await _supabase
        .storage
        .from("files")
        .upload(valid_email+"/"+file.name, file, {
            cacheControl: '3600',
            upsert: false
        })
    if(error==null){
        console.log(data)
    }
    else{
        console.log(error)
        return
    }
    data.fullPath
    const f = await fetch("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files.json")
    const json =  await f.json()
    const num = json.num + 1 
    const json_to_up = JSON.stringify({
        "file": "https://jupjgyhsopjypuwltlhd.supabase.co/storage/v1/object/public/"+data.fullPath,
        "name": file.name,
        "type": file.type
    })
    const put = await fetch("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files/"+num+".json",{
        headers:{
            'Accept': 'application/json',
            'Content-Type': "application/json",
        },
        method: "PUT",
        body: json_to_up
    })
    if(put.status==200){

    }
    else{
        alert("ERROR: file is to big")
        return
    }
        const put_num = await fetch("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files.json",{
        headers:{
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({"num": num})
        })
        if(put.status==200){
            if(put.status==200){
                window.location.replace("../dashboard/index.html")
            }
        }
    }
function end_upload(){
    window.location.replace(".")
}