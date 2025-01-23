let token= localStorage.getItem("authToken")

if(token) {
    console.log (token)
    let adminBar= document.querySelector(".edition")
    adminBar.innerHTML= `<img class="group_3" src="assets/icons/Group 3.png">`
    let addBtn= document.querySelector("#add-work-btn")
    addBtn.style.display = "block"
}