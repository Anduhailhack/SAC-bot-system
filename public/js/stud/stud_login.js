const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", (event) => {
	let email = document.getElementById("email").value;
	let loginCaption = document.getElementById("caption");
	loginCaption.classList.remove("warning");
	loginCaption.innerText = "Enter your email to login.";

	if (webApp.isValidEmail(email)){
		fetch("/stud_login", {
			method: "post",
			headers : {
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				email,
				initData : webApp.getInitData()
			})
		}).then((res) => {
			res.json().then((data)=>{
				if (data.result){
					if (data.status){
						console.log(data)
						fetch(data.result.route)
						.then( response => response.text() )
						.then( result => {
								let parser = new DOMParser();
								doc = parser.parseFromString( result, 'text/html' );
								document.replaceChild( doc.documentElement, document.documentElement );

								const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js?1"]');
								const newScript = document.createElement('script');
								newScript.src = script.src;

								const script3 = document.querySelector('script[src="/js/stud/stud_verify.js"]');
								const newScript3 = document.createElement('script');
								newScript3.src = script3.src;

								script.replaceWith(newScript);
								script3.replaceWith(newScript3)
							});
					}
						// window.location.href = data.result.route
					if (data.result.msg){
						loginCaption.classList.remove("warning");
						loginCaption.innerText = data.result.msg;
					}
				}else {
					if (data.msg){
						loginCaption.classList.add("warning");
						loginCaption.innerText = data.msg;
					}
				}
			}).catch((err)=>{
				console.log("Distructure json: ", err)
				loginCaption.classList.add("warning");
				loginCaption.innerText = JSON.stringify(err);
				
			})
		}).catch((err) => {
			
			console.log("Original post: ", err)
			loginCaption.classList.add("warning");
			loginCaption.innerText = "Fetch Error, could not send data to backend.";
		})
	}
	else {
		loginCaption.classList.add("warning");
		loginCaption.innerText = "'" + email + "'" + " is not a valid email.";
	}
});
