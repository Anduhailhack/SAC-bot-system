const signupBtn = document.getElementById("signup-btn");
const signupCaption = document.getElementById("caption");

signupBtn.addEventListener("click", (event) => {
	signupCaption.classList.remove("warning");

	let providerId = document.getElementById("id").value;
	let fName = document.getElementById("f-name").value;
	let lName = document.getElementById("l-name").value;
	let email = document.getElementById("email").value;
	let phoneNo = document.getElementById("phone-no").value;
	let educationalBkg = document.getElementById("educational-bkg").value;
	let speciality = document.getElementById("speciality").value;
	let officeLocation = document.getElementById("office-location").value;
	let healthTeam = document.getElementById("health-team").value;
	let startAt = document.getElementById("start-at").value;
	let endAt = document.getElementById("end-at").value;
	let dateCheckbox = document.getElementsByName("dates")
	let dates = []

	for (var i = 0; i < dateCheckbox.length; i++) {
		if (dateCheckbox[i].checked) {
		  dates.push(dateCheckbox[i].value);
		}
	  }
	if (verify(providerId, fName, lName, email, phoneNo)){
		signupBtn.setAttribute('disabled', 'disabled')
		signupBtn.setAttribute('style', 'opacity: 0.5;');

		caption.innerText = ""
		
		fetch("/sp_signup", {
			method: "post",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				provider_id : providerId,
				f_name: fName,
				l_name: lName,
				email: email, 
				phone_no: phoneNo,
				educational_bkg: educationalBkg,
				health_team: healthTeam,
				speciality: speciality,
				office_location: officeLocation,
				available_at : {
					starting_time: startAt,
					ending_time: endAt,
					dates,
				},
				initData : webApp.getInitData()
			})
		}).then((response)=> response.json())		//check
		.then((result) => {
			if(result.status){
				if (result.result.route){
					webApp.showAlert("You have successfully signed up. Please Verify your account by inserting the token from your email.")
					fetch(result.result.route)
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
				// caption.innerText = ""
				// window.location.href = result.result.route
				// return;
			} 
			
			// if(result.result.error_code == 11000){
			// 	webApp.showAlert("This email has already been registered. Please login.")
			// 	window.location.href = result.result.route
			// 	return;
			// } 
			else {
				signupBtn.removeAttribute('disabled')
				signupBtn.style.opacity = 1
				caption.classList.add("warning")
				caption.innerText = result.result.msg
			}
		}).catch((err) => {
			signupBtn.removeAttribute('disabled')
			signupBtn.style.opacity = 1
			if(err.data && err.data.result && 
			   err.data.result.error_code && 
			   err.data.result.error_code == 11000){
				webApp.showAlert("This email has already been registered. Please login.")
			}
		})
	}

	
});


const verify = function(providerId, fName, lName, email, phoneNo){
	if(!webApp.isTashID(providerId)){
		signupCaption.classList.add('warning')
		signupCaption.innerText = "Invalid TASH provider ID"
		return false
	}
	if(!webApp.isName(fName)){
		signupCaption.classList.add("warning")
		signupCaption.innerText = "Your First Name is not valid!"
		return false
	}

	if(!webApp.isName(lName)){
		signupCaption.classList.add("warning")
		signupCaption.innerText = "Your Last Name is not valid!"
		return false
	}
	if (!webApp.isValidEmail(email)) {
		signupCaption.classList.add("warning");
		signupCaption.innerText = "Your email is not a valid email!";
		return false;
	}
	if(!webApp.isPhoneNo(phoneNo)){
		caption.classList.add("warning");
		caption.innerText = "Your phone number is not a valid phone number!";
		return false;
	}
	return true;
}