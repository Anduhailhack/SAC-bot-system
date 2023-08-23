const loginBtn = document.getElementById("login-btn");

let loginCaption = document.getElementById("caption");
loginCaption.classList.remove("warning");

loginBtn.addEventListener("click", (event) => {
	let email = document.getElementById("email").value;
	loginCaption.innerText = "Enter your email to login.";

	if (webApp.isValidEmail(email)){
		fetch("/sp_login", {
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
					if (data.result.route){
						fetch(data.result.route)
							.then( response => response.text() )
							.then( result => {
									let parser = new DOMParser();
									doc = parser.parseFromString( result, 'text/html' );
									document.replaceChild( doc.documentElement, document.documentElement );

									const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js?1"]');
									const newScript = document.createElement('script');
									newScript.src = script.src;

									// const script2 = document.querySelector('script[src="../../js/script.js"]');
									// const newScript2 = document.createElement('script');
									// newScript2.src = script2.src;

									const script3 = document.querySelector('script[src="/js/sp/sp_verify.js"]');
									const newScript3 = document.createElement('script');
									newScript3.src = script3.src;

									script.replaceWith(newScript);
									// script2.replaceWith(newScript2)
									script3.replaceWith(newScript3)
								} );
					}
						// window.location.href = data.result.route
					if (data.result.msg){
						loginCaption.classList.add("warning");
						loginCaption.innerText = data.result.msg;
					}
				}
			}).catch((err)=>{
				console.log(err);
			})
		}).catch((err) => {
			loginCaption.classList.add("warning");
			loginCaption.innerText = "Fetch Error, could not send data to backend.";
		})
	}
	else {
		loginCaption.classList.add("warning");
		loginCaption.innerText = "'" + email + "'" + " is not a valid email.";
	}
});
