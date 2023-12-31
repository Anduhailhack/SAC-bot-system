const verifyBtn = document.getElementById("verify-btn");
caption.classList.remove("warning");

verifyBtn.addEventListener("click", (event) => {
	let token = document.getElementById("token").value;
	let caption = document.getElementById("caption");
	caption.innerText = "Enter your verification token down here.";

	if (token){
		fetch("/stud_verify", {
			method: "post",
			headers: {
				"Content-Type" : "application/json",
				"Accept" : "application/json"
			}, 
			body: JSON.stringify({
				token,
				initData : webApp.getInitData()
			})
		}).then((res) => {
			res.json().then((data)=> {
				if(data.status && data.status == "success"){
					webApp.close()
				}
				else if (data.status && data.status == "unauthorized") {
					caption.classList.add("warning")
					caption.innerText = data.result.msg
				}
				else {
					caption.classList.add("warning")
					caption.innerText = "Invalid Token, Try again"
				}
			}).catch((err) => {
				console.log(err);
			})
		}).catch((err) => {
			caption.classList.add("warning");
			caption.innerText = "Fetch Error, could not send data to backend.";
		})
	}
	else {
		caption.classList.add("warning");
		caption.innerText = "Token cannot be empty.";
	}
});


