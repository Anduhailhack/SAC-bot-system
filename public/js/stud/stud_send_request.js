const sendReqBtn = document.querySelector("#btn-send-req")
const sendReqCap = document.querySelector("#caption");

sendReqBtn.addEventListener('click', envent => {
    sendReqCap.classList.remove("warning");
    const sp_team = document.querySelector("#sp_team")
    const code1 = document.querySelector("input[name=code_1]:checked")
    const code2 = document.querySelector("input[name=code_2]:checked")
    const code3 = document.querySelector("input[name=code_3]:checked")
    const code4 = document.querySelector("input[name=code_4]:checked")
    const code5 = document.querySelector("input[name=code_5]:checked")
    const remark = document.querySelector("#remarks")

    if (!code1 || !code2 ||
        !code3 || !code4 ||
        !code5) {
        sendReqCap.classList.add("warning")
        sendReqCap.innerText = "Fill the following questionier accordingly." 
        return;
    }

    fetch("/stud_send_request", {
        method: "post",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({            
            sp_team : sp_team.value,
            diagnosis : {
                code1 : code1.value,
                code2 : code2.value,
                code3 : code3.value,
                code4 : code4.value,
                code5 : code5.value,
                remark : remark.value
            },
            initData : webApp.getInitData()
        })
    }).then((res) => {
        res.json().then((data)=>{
            if (data.result){
                if (data.status && data.status == "success" &&
                    data.result && data.result.msg){
                    webApp.showAlert(data.result.msg)
                    webApp.close()
                }
            }else {
                if (data.msg){
                    sendReqCap.classList.add("warning");
                    sendReqCap.innerText = data.msg;
                }
            }
        }).catch((err)=>{
            console.log("Distructure json: ", err)
            sendReqCap.classList.add("warning");
            sendReqCap.innerText = JSON.stringify(err);  
        })
    }).catch((err) => {
        console.log("Original post: ", err)
        sendReqCap.classList.add("warning");
        sendReqCap.innerText = "Fetch Error, could not send data to backend.";
    })
})