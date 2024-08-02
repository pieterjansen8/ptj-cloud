const email = localStorage.getItem("email")
const valid_email = email.replace(".", "")

function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}

async function upload(){
    const file_name = document.getElementById("file_name")
    const file = document.getElementById("file-upload").files[0]
    file_name.innerHTML = "File to upload: "+file.name
    const div = document.getElementById("upload_div")
    const new_div = document.createElement("div")
    new_div.id = "new_div"
    div.appendChild(new_div)
    new_div.innerHTML = "<button class='button-17' role='button' onclick='real_upload()'>Upload</button>"
}
async function real_upload(){
    const file = document.getElementById("file-upload").files[0]
    var reader = new FileReader()
    reader.onloadend = async function(){
        const res  = reader.result
        const f = await fetch("https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"+valid_email+"/files.json")
        const json =  await f.json()
        const num = json.num + 1 
        const json_to_up = JSON.stringify({
            "file": res,
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
    reader.readAsDataURL(file)
}
function end_upload(){
    window.location.replace(".")
}