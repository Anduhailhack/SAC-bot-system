const reqContainer = document.querySelector(".requests");

fetch("/sp/check_requests/" + webApp.getInitData())
.then((value) => {
    console.log(value)
})
.catch((err) => {
    console.log(err)
})