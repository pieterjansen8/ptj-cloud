const url = "https://pieterapi-c8b9e-default-rtdb.europe-west1.firebasedatabase.app/"
function setup(){
    const logged = localStorage.getItem("logged")
    if(logged=='true'){
        get_in_acc()
    }
}
setup()
async function get_acc(){
    const email = document.getElementById("email").value
    const valid_email = email.replace(".", "")
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
    const valid_email = email.replace(".", "")
    if(acc_exist==true){
        const req = await fetch(url+valid_email+".json")
        const json = await req.json()
        if(json.password==password){
            localStorage.setItem("email", email)
            localStorage.setItem("password", password)
            localStorage.setItem("logged", true)
            get_in_acc()
        }
        else{
            alert("ERROR Wrong password!")
            return
        }
    }
    const body = JSON.stringify({
        "password": password, 
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
    localStorage.setItem("email", email)
    localStorage.setItem("password", password)
    localStorage.setItem("logged", true)
    get_in_acc()
}
async function get_in_acc(){
    window.location.replace("./dashboard/index.html")
}
