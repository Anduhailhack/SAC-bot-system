const signupBtn = document.getElementById("signup-btn");
const caption = document.getElementById("caption");

signupBtn.addEventListener("click", (event) => {
	caption.classList.remove("warning");
	
	let studId = document.getElementById("id").value;
	let fName = document.getElementById("f-name").value;
	let lName = document.getElementById("l-name").value;
	let email = document.getElementById("email").value;
	let phoneNo = document.getElementById("phone-no").value;
	 
	let batch = document.getElementById("batch").value;
	let department = document.getElementById("dept").value;

	if (verify(studId, fName, lName, email, phoneNo)){
		signupBtn.setAttribute('disabled', 'disabled')
		signupBtn.setAttribute('style', 'opacity: 0.5;');

		caption.innerText = ""
		
		fetch("/stud_signup", {
			method: "post",
			headers : {
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				stud_id : studId,
				f_name: fName,
				l_name: lName,
				email,
				phone_no: phoneNo,
				ed_info: {
					batch,
					department
				}, 
				initData : webApp.getInitData()
			})
		}).then((response)=> response.json())
		.then((res) => {
				console.log(res)
				if(res.status){
					fetch(res.result.route)
					.then( response => response.text() )
					.then( result => {
							webApp.showAlert("You have successfully signed up. Please Verify your account by inserting the token from your email.")
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
						} );
					

					// caption.innerText = ""
					// window.location.href = res.result.route
					// return;
				}
				// else if(res.result.error_code && res.result.error_code == 11000){
				// 	caption.innerText = res.result.msg
				// 	caption.classList.add("warning");
				// 	webApp.showAlert("User with this email has already registered. Plese Login")
				// 	window.location.href = res.result.route
				// 	return;
				// }
				else {
					caption.innerText = res.result.msg
					caption.classList.add("warning");
					signupBtn.removeAttribute('disabled')
					signupBtn.style.opacity = 1

				}
		}).catch((err) => {
			signupBtn.removeAttribute('disabled')
			signupBtn.style.opacity = 1
			caption.classList.add("warning");
			caption.innerText = "Fetch Error, could not send data to backend.";
		})
		
	}
});

function verify(studId, fName, lName, email, phoneNo){
	if(!webApp.isTASHStudId(studId)){
		caption.classList.add("warning")
		caption.innerText = "Your TASH ID is not valid"
		return false
	}

	if(!webApp.isName(fName)){
		caption.classList.add("warning")
		caption.innerText = "Your First Name is not valid!"
		return false
	}

	if(!webApp.isName(lName)){
		caption.classList.add("warning")
		caption.innerText = "Your Last Name is not valid!"
		return false
	}
	if (!webApp.isValidEmail(email)) {
		caption.classList.add("warning");
		caption.innerText = "Your email is not a valid email!";
		return false;
	}
	if(!webApp.isPhoneNo(phoneNo)){
		caption.classList.add("warning");
		caption.innerText = "Your phone number is not a valid phone number!";
		return false;
	}
	return true;
}