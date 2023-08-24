var submit = document.getElementById("submit")
var chapaForm = document.getElementById("chapaForm")


var caption = document.getElementById("caption")
// var tx_ref = document.getElementById("tx_ref").value
var amount = document.getElementById("amount").value
var email = document.getElementById("email").value
var first_name = document.getElementById("first_name").value
var last_name = document.getElementById("last_name").value
var title = document.getElementById("title").value
var description = document.getElementById("description").value

submit.addEventListener("click", (event)=>{
    var tx_ref = `txRef-${Date.now()}`
    alert(`Your tx_ref is ${tx_ref}`)

    var amount = document.getElementById("amount").value
    var email = document.getElementById("email").value
    var first_name = document.getElementById("first_name").value
    var last_name = document.getElementById("last_name").value
    var phone_number = document.getElementById("phone_number").value
    var title = document.getElementById("title").value
    var description = document.getElementById("description").value


    fetch('/chapaPay', {
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            tx_ref,
            amount,
            // currency,
            email,
            first_name,
            last_name,
            title,
            phone_number,
            description,
        })
    }).then((result) =>  result.json()
    ).then((res) => {
        if(res.status == "error"){
            caption.innerText = res.result.msg
            caption.classList.add("warning")
            webApp.showAlert(res.result.msg)
        } else if (res.status == "success"){
            window.location.href = res.result.data.checkout_url
        }
    })
})
