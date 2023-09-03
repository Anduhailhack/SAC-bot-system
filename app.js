const express = require("express");
const axios = require("axios");
const path = require("path")
const { Telegraf } = require("telegraf");
const { db } = require('./database/Mongo'); //something like mongoose
// const { session } = require('telegraf-session-mongodb'); //session control test
const { ServiceProvider } = require("./routes/ServiceProvider");
const { Admin } = require("./routes/Admin");
const { Student } = require("./routes/Student");
const {
	home,
	login,
	signup,
	aboutUs,
	generalError,
} = require("./routes/General");
const {
	isEmail, 
	isName, 
	isValidInitData
} = require("./util/Validator")

/* --- DEV DEPENDANCIES --- */

require("dotenv").config(); 
const { HttpsProxyAgent } = require("https-proxy-agent"); 
const { log } = require("console");

/* --- --------------- --- */

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.set("view engine", "ejs");

/** student endpoints */
app.get("/stud/send_requests", (req, res) => {
	res.render('html' + path.sep + 'stud' + path.sep + 'stud_send_requests');
});

app.get("/stud/check_appointments", (req, res) => {
	res.render('html' + path.sep + 'stud' + path.sep + 'stud_check_appointments');
});

app.get("/stud/login", (req, res) => {
	res.render('html' + path.sep + 'stud' + path.sep + 'stud_login');
});

app.get("/stud/signup", (req, res) => {
	res.render('html' + path.sep + 'stud' + path.sep + 'stud_signup');
});

app.get("/stud/verify", (req, res) => {
	res.render('html' + path.sep + 'stud' + path.sep + 'stud_verify');
});

/** --------------------------------------- */

/** service provider */
app.get("/donate", (req, res) => {
	res.render('html' + path.sep + 'donate' + path.sep + 'donate');
});

app.get("/donateAccepted", (req, res) => {
	res.render('html' + path.sep + 'donate' + path.sep + 'donateAccepted');
});

app.get("/sp/check_appointments", (req, res) => {
	res.render('html' + path.sep + 'sp' + path.sep + 'sp_check_appointments');
});

app.get("/sp/login", (req, res) => {
	res.render('html' + path.sep + 'sp' + path.sep + 'sp_login');
});

app.get("/sp/signup", (req, res) => {
	res.render('html' + path.sep + 'sp' + path.sep + 'sp_signup');
});

app.get("/sp/verify", (req, res) => {
	res.render('html' + path.sep + 'sp' + path.sep + 'sp_verify');
});

app.get("/sp/check_requests", (req, res) => {
	res.render('html' + path.sep + 'sp' + path.sep + 'sp_check_requests');
});

app.get('/sp/set_appointment', (req, res) => {
	const studInfo = JSON.parse((new Buffer.from(req.query.stud_info, 'base64')).toString('ascii'))
	const diagnosis = JSON.parse((new Buffer.from(req.query.diagnosis, 'base64')).toString('ascii'))
	const spInfo = JSON.parse((new Buffer.from(req.query.sp_info, 'base64')).toString('ascii'))

	res.render('html' + path.sep + 'sp' + path.sep + 'set_appointment', {
		studInfo, diagnosis, spInfo
	})
})

/** ---------------------------------- */

app.listen(process.env.PORT || 3000, "localhost", () => {
	console.log("Server listening on port 3000");
});

const botToken = process.env.BOT_TOKEN || "";
const bot = new Telegraf(botToken);
// , {
// 	telegram: {
// 		agent: new HttpsProxyAgent("http://127.0.0.1:3333"),
// 	},
// });

  
app.post('/sp_signup', (req, res) => {
	const {provider_id, f_name, l_name, email, phone_no,		//Telegram ID
		educational_bkg, work_exp, health_team,
		office_location, available_at, initData} = req.body;
	
	const decodedUrlParams = new URLSearchParams(initData);
	const userId = JSON.parse(decodedUrlParams.get("user")).id;

	if (!isValidInitData(initData))
	{
		res.status(401).json({
			status: "error",
			result: {
				msg: "Not a valid request."
			}
		})
		return;
	}
	
	axios.post(process.env.API + "/service-provider/signup", { 
		provider_id, f_name, l_name, email, phone_no,		//Telegram ID
		educational_bkg, work_exp, sp_team : health_team,
		office_location, available_at, telegram_id : userId
	})
	.then((response) => {
		console.log(response)
		if (response.data.status && response.data.status == "success") {
			res.status(200).json({
				status : response.data.status,
				result : {
					msg : response.data.result.msg,
					route: process.env.BASE_WEB_API + "/sp/verify"
				}
			})
		} else if (response.data.status && response.data.status == "error" ){				// If the error from the backend is 'error' {whether it is from the res. or from the catch}
				res.status(500).json({
					status: false,
					result: {
						msg: response.data.result.msg || "Error not caught in catch"
					}
				})
		}
	}).catch((err) => {
		console.log(err.response.data)
		if(err.response.data.result && err.response.data.result.err && err.response.data.result.err.message){
			res.status(401).json({
				status: false,
				result: {
					msg: err.response.data.result.err.message,
					// route: process.env.BASE_WEB_API + "/html/sp/sp_login.html"
				}
			})
			return;
		}

		if (err.response.data && err.response.data.status && err.response.data.status == "error"){
			res.status(401).json({
				status: false,
				result: {
					msg: (err.response.data.result && err.response.data.result.msg) ? err.response.data.result.msg : "Axios Error: Can not send data to backend",			
				}
			})
		}
	})

})

app.post('/sp_login', (req, res) => {
	const { email, initData } = req.body

	if(!isEmail(email) || !isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Invalid request!"
			}
		})
		return
	}

	axios.post(process.env.API + "/service-provider/login", { email })
	.then((response) => {
		if( response.data.status && response.data.status == "success"){
			res.status(200).json({
				status: response.data.status,
				result: {
					msg: response.data.result.msg,		// You should have received a token via email
					route: process.env.BASE_WEB_API + "/sp/verify"
				}
			})
		}

		else if( response.data.status && response.data.status == "error"){
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg		//msg: Couldn't send an email
				}
			})
		}

		else if (response.data.status && response.data.status == "unauthorized"){
			res.status(401).json({
				status: "error",
				result: {
					msg : response.data.result.msg
				}
			})
		}
	})
	.catch((error) => {
		// console.log(error.response);
		res.status(500).json({
			status : "error",
			result : {
				msg : (
						error.response && 
						error.response.data && 
						error.response.data.result && 
						error.response.data.result.msg
					) ? error.response.data.result.msg : "Syncronization faild, please try again later.",
			}
		})
	})
})

app.post('/sp_verify', (req, res) => {
	const { token, initData} = req.body;

	if(!token || !isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Not a valid request."
			}
		})
		return;
	}

	const decodedUrlParams = new URLSearchParams(initData);
	const userId = JSON.parse(decodedUrlParams.get("user")).id;
	const fName = JSON.parse(decodedUrlParams.get("user")).first_name;

	axios.post(process.env.API +"/service-provider/verify", {token})
	.then((response) => {
		if(response.data.status && response.data.status == "success"){
			db.addSession(`${userId}:${userId}`, {
				token : `${response.data.result.token}`,
				expiration : new Date(new Date().getTime() + (response.data.result.expiration * 60 * 60 * 60)),
				role : response.data.result.role
			}, 
			function (retVal){
				if (retVal && retVal.status) {
					res.status(200).cookie({msg: response.data.result.token}).json({
						status: "success",
						result: {
							msg: response.data.result.msg
						}
					})
	
					let serviceProvider = new ServiceProvider(bot);
					serviceProvider.home(userId, fName);
				}else if (retVal && !retVal.status) {
					return res.status(401).cookie({msg: response.data.result.token}).json({
						status: "error",
						result: {
							msg: "Couldn't set a session."
						}
					})
				}
			})
			// try {
			// 	let isSucc = collection.replaceOne(
			// 		{ key: `${userId}:${userId}` },
			// 		{ key: `${userId}:${userId}`, data: },
			// 		{ upsert: true }
			// 	)

			// } catch (error) {
			// 	isSucc = {no : 0}
			// 	console.log(error)
			// }

			// if (isSucc.no == 1){
			// 	res.status(200).cookie({msg: response.data.result.token}).json({
			// 		status: "success",
			// 		result: {
			// 			msg: response.data.result.msg
			// 		}
			// 	})

			// 	let serviceProvider = new ServiceProvider(bot);
			// 	serviceProvider.home(userId, fName);
			// }else {
			// 	try {
			// 		const isSucc2 = collection.insertOne(
			// 			{ key: `${userId}:${userId}` },
			// 			{ key: `${userId}:${userId}`, data: {
			// 				token : `${response.data.result.token}`
			// 			}},
			// 			{ upsert: true }
			// 		)
			// 		if (isSucc2.acknowledged) {
			// 			res.status(200).cookie({msg: response.data.result.token}).json({
			// 				status: "success",
			// 				result: {
			// 					msg: response.data.result.msg
			// 				}
			// 			});
	
			// 			let serviceProvider = new ServiceProvider(bot);
			// 			serviceProvider.home(userId, fName);
			// 		} else {
			// 			return res.status(401).cookie({msg: response.data.result.token}).json({
			// 				status: "error",
			// 				result: {
			// 					msg: "Couldn't set a session."
			// 				}
			// 			})
			// 		}
			// 	}catch (err) {
			// 		console.log(err)
			// 		return res.status(401).cookie({msg: response.data.result.token}).json({
			// 			status: "error",
			// 			result: {
			// 				msg: "Couldn't set a session. try logout first"
			// 			}
			// 		})
			// 	}

			// }
			// res.status(200).cookie({msg: response.data.result.msg}).json({
			// 	status: "success",
			// 	result: {
			// 		msg: response.data.result.msg
			// 	}
			// })

			
		// } else {
		// 	res.status(500).json({
		// 		status: "error",
		// 		result: {
		// 			msg: response.data.result.msg
		// 		}
		// 	})
		}
	}).catch((error) => {
		console.log(error)
		res.status(500).json({
			status: "success",
			result: {
				msg: "Axios Error, Cannot send data to the backend"
			}
		})
	})	
})

app.post('/sp/notify_student_request', async (req, res) => {
	const {initData, msg, stud_info, diagnosis, telegram_id} = req.body
	
	if(!isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Not a valid request."
			}
		})
		return;
	}
	
	if (typeof telegram_id == 'object'){
		for (let i = 0; i < telegram_id.length; i++){
			console.log(telegram_id[i])
			await setTimeout(() => 
				bot.telegram.sendMessage(
					telegram_id[i].telegram_id, 
					`
						<b>New student send you a diagnosis request.</b>
						🔹 Student ID : ${stud_info.result[0].stud_id}
						🔹 Name : ${stud_info.result[0].f_name} ${stud_info.result[0].l_name}
						🔹 Email : <a mailto='${stud_info.result[0].email}'>email</a>
						🔹 Phone no : ${stud_info.result[0].phone_no}
					`,
					{
						parse_mode: "HTML",
						reply_markup : {
							inline_keyboard :[
								[{
									text: "✅ Accept and Set appointment",
									web_app : {
										url : process.env.BASE_WEB_API + "/sp/set_appointment?stud_info=" + 
												(new Buffer.from(JSON.stringify(stud_info.result[0]))).toString('base64') +
												"&diagnosis=" + (new Buffer.from(JSON.stringify(diagnosis))).toString('base64') +
												"&sp_info=" + (new Buffer.from(JSON.stringify(telegram_id[i]))).toString('base64')
									}
								}], [{
									text: "❌ Reject",
									callback_data : "reject_stud_request"
								}]
							]
						}
					}
				)
			, 3000);
		}
	}
	res.status(202).json({
		status: "success",
		result: {
			msg: "Your request sent."
		}
	})
})

app.post('/sp/set_appointment', async (req, res) => {
	const {initData} = req.body
	
	if(!isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Not a valid request."
			}
		})
		return;
	}

	
})

app.get('/sp_edit_appointment/:appointmentId/:initData', (req, res) => {
	//WebApp legitmacy check fails here but i'll try few thingswhat 
	let collection = db.collection("sessions");
	const initData = req.params.initData

	if(!isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Not a valid request."
			}
		})
		return;
	}

	const decodedUrlParams = new URLSearchParams(initData);
	const userId = JSON.parse(decodedUrlParams.get("user")).id;

	collection.findOne({key : `${userId}:${userId}`}).then((value) => {
		if (req.params.appointmentId && value && value.data && value.data.token){
			console.log(req.params.appointmentId);
			
			axios.get(process.env.API + "/service-provider/getAppointment/" + req.params.appointmentId, {
				headers: {
					Cookie: "token=" + value.data.token + ";"
				}
			}).then((response) => {
				console.log(response);
				res.render('html' + path.sep + 'sp' + path.sep + 'sp_edit_appointment', {
					token : value.data.token
				});
			}).catch((error) => {console.log(error)})
		}
	}).catch((reason)=>{
		res.status(403).json({
			status : "unauthorized",
			result: {
				msg: "unauthorized request"
			}
		})
	})

	
})

app.get("/sp/check_requests/:initData", (req, res) => {
	const {initData} = req.params;
	const collection = db.collection("sessions");

	if(!isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Not a valid request."
			}
		})
		return;
	}

	//lets brainstorm ideas here
	// res.render('html' + path.sep + 'sp' + path.sep + 'sp_check_requests');
})



app.post('/stud_signup', (req, res) => {
	const {stud_id, f_name, l_name, email, phone_no, ed_info, initData} = req.body

	if(!isValidInitData(initData)){
		return res.status(401).json({
			status: "error",
			result: {
				msg: "Invalid request!"
			}
		})
	}

	const decodedUrlParams = new URLSearchParams(initData);
	const userId = JSON.parse(decodedUrlParams.get("user")).id;

	axios.post(process.env.API + "/user/signup", 
		{stud_id, f_name, l_name, email, phone_no, telegram_id : userId, ed_info})
		.then((response) => {
			if (response.data.status && response.data.status == "success"){
				res.status(200).json({
					status: true,
					result: {
						msg: response.data.result.msg,
						route: process.env.BASE_WEB_API + '/stud/verify'
					}
				})
			} else {
				res.status().json({
					status: false,
					result: {
						msg: response.data.result.msg
					}
				})
			}
		}).catch((error) => {
			if(error.response && error.response.data && error.response.data.status == "error"){
				return res.status(500).json({
					status: false,
					result: {
						msg: error.response.data.result.msg
					}
				})
			}
			// if(error.response.status == 409){
			// 	return res.status(409).json({
			// 		status: false,
			// 		result: {
			// 			msg: error.response.data.result.msg,
			// 			error_code: error.response.data.result.error_code,
			// 			route: process.env.BASE_WEB_API + '/html/stud/stud_login.html'
			// 		}
			// 	})
			// }

			return res.status(500).json({
				status: false,
				result: {
					msg: error.response.data.result.msg || "Axios Error, Couldn't send data to the backend"
				}
			})
		}) 
})

app.post('/stud_login', (req, res) => {
	const {email, initData} = req.body;

	if(!isEmail(email) || !isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Invalid request!"
			}
		})
		return
	}

	axios.post(process.env.API + "/user/login", {email})
		.then((response) => {
			if(response.data.status && response.data.status == "success"){
				res.status(200).json({
					status: "success",
					result: {
						msg: response.data.result.msg,
						route: process.env.BASE_WEB_API + '/stud/verify'
					}
				})
			} else {
				res.status(500).json({
					status: "error",
					result: {
						msg: response.data.result.msg
					}
				})
			}
		}).catch((error)=> {
			let {response} = error
			 
			res.status(401).json({
				status: "error",
				msg: (response.data && response.data.result && response.data.result.msg) ? response.data.result.msg : "Error, some sort of error happened."
			})
		})
})

app.post('/stud_verify', (req, res) => {
	const {token, initData} = req.body;

	if(!isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Invalid request!"
			}
		})
		return
	}

	const decodedUrlParams = new URLSearchParams(initData);
	const userId = JSON.parse(decodedUrlParams.get("user")).id;
	const fName = JSON.parse(decodedUrlParams.get("user")).first_name;

	axios.post(process.env.API + "/user/verify", {token})
		.then(async (response) => {

			if(response.data.status && response.data.status == "success"){
				
				db.addSession(`${userId}:${userId}`, {
					token : `${response.data.result.token}`,
					expiration : new Date(new Date().getTime() + (response.data.result.expiration * 60 * 60 * 60)),
					role : response.data.result.role
				}, 
				function (retVal){
					console.log(retVal)
					if (retVal && retVal.status) {
						res.status(200).cookie({msg: response.data.result.token}).json({
							status: "success",
							result: {
								msg: response.data.result.msg
							}
						})
		
						let student = new Student(bot);
						student.home(userId, fName);
					}else if (retVal && !retVal.status) {
						return res.status(401).cookie({msg: response.data.result.token}).json({
							status: "error",
							result: {
								msg: "Couldn't set a session."
							}
						})
					}
				})
					
			} else {
				res.status(500).json({
					status: "error",
					result: {
						msg: response.data.result.msg
					}
				})
			}
	}).catch((error) => {
		res.status(500).json({
			status: "success",
			result: {
				msg: "Axios Error, Cannot send data to the backend"
			}
		})
	})
})

app.post('/stud_send_request', async (req, res) => {
	const {sp_team, diagnosis, initData} = req.body;
	
	if(!isValidInitData(initData)){
		res.status(401).json({
			status: "error",
			result: {
				msg: "Invalid request!"
			}
		})
		return
	}
	
	const decodedUrlParams = new URLSearchParams(initData);
	const userId = JSON.parse(decodedUrlParams.get("user")).id;

	db.getSession(`${userId}:${userId}`, function (retVal) {
		if (retVal && retVal.status) {
			axios.post(process.env.API + "/user/addRequest", {
				client : "telegram",
				callbackUrl : process.env.BASE_WEB_API + "/sp/notify_student_request",
				stud_id : userId,
				sp_team : sp_team,
				token : retVal.result.data.data.token,
				issuedAt : new Date().getTime(),
				diagnosis : diagnosis,
				initData : initData,
			}).then((response) => {
				if(response.data.status && response.data.status == "success"){
					res.status(200).json({
						status: "success",
						result: {
							msg: "Your request sent successfully, we will notify you as soon as a service provider take a look at it."
						}
					})
				} else {
					res.status(500).json({
						status: "error",
						result: {
							msg: response.data.result.msg
						}
					})
				}
			}).catch((error) => {
				res.status(500).json({
					status: "error",
					result: {
						msg: "Axios Error, Cannot send request to the backend " + JSON.stringify(error)
					}
				})
			})
		}else if (retVal && !retVal.status) {
			res.status(401).json({
				status: "error",
				result: {
					msg: "Unauthorized action : " + retVal.result.msg
				}
			})
		}
	})
	/*
	let collection = db.collection("sessions");
	await collection.findOne({key: `${userId}:${userId}`})
	.then((value) => {
		if (value && value.data && value.data.token){
			axios.post(process.env.API + "/user/addRequest", {
				client : "telegram",
				callbackUrl : process.env.BASE_WEB_API + "/sp/notify_student_request",
				stud_id : userId,
				sp_team : sp_team,
				token : value.data.token,
				issuedAt : new Date().getTime(),
				diagnosis : diagnosis,
				initData : initData,
			}).then((response) => {
				if(response.data.status && response.data.status == "success"){
					res.status(200).json({
						status: "success",
						result: {
							msg: "Your request sent successfully, we will notify you as soon as a service provider take a look at it."
						}
					})
				} else {
					res.status(500).json({
						status: "error",
						result: {
							msg: response.data.result.msg
						}
					})
				}
			}).catch((error) => {
				console.log("Line 585 :- ", error)
				res.status(500).json({
					status: "error",
					result: {
						msg: "Axios Error, Cannot send request to the backend " + JSON.stringify(error)
					}
				})
			})
		}		
	})
	.catch((err) => {
		console.log(err)
		res.status(401).json({
			status: "error",
			result: {
				msg: "Invalid request, you gonna have to login first."
			}
		})
	})	
	*/
})



app.post('/admin_signup', (req, res) => {
const { f_name, l_name, email, speciality,
		working_hour, communication, phone_no } = req.body;

	axios.post(process.env.API+"/admin/signup", {
		f_name, l_name, email, speciality,
		working_hour, communication, phone_no
	}).then((response) => {
		if(response.data.status && response.data.status == "success"){
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg,
					route: './html/admin/admin_verify.html'
				}
			})
		} else {
			res.status(200).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
	}).catch((error) => {
		res.status(500).json({
			status: "error",
			result: {
				msg: "Axios Error, Can not fetch data to backend"
			}
		})
	})

})

app.post('/admin_login', (req, res) => {
const { email } = req.body;

axios.post(process.env.API + "/admin/login", {
	email
})
	.then((response) => {
		if(response.data.status && response.data.status == "success"){
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg,
					route: './html/admin/admin_verify.html'
				}
			})
		} else {
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
	}).catch((error)=> {
		res.status(401).json({
			status: "error",
			msg: "Axios Error, Can not send data to the backend"
		})
	})
})

app.post('/admin_verify', (req, res) => {
const { token } = req.body;

axios.post(process.env.API + "/admin/verify", { token })
	.then((response) => {
		if (response.data.status && response.data.status == "success"){
			// bot.use((ctx, next)=>{
			// 	ctx.session.token = response.data.result.token;
			// 	next()
			// })
			// TO BE futher tested.
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg
				}
			})
		} else {
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
}).catch((error) => {
	res.status(500).json({
		status: "success",
		result: {
			msg: "Axios Error, Cannot send data to the backend"
		}
	})
})
})


app.post('/chapaPay', (req, res) => {
	let {public_key, tx_ref, amount, currency, email, first_name, last_name, title, phone_number, description, logo, callback_url, return_url, meta} = req.body
   
   public_key = "CHAPUBK_TEST-1GsPpSPDWRaIReY7bZBV044i6oBbHUue"
   callback_url = process.env.BACKEND_API + "/payment/chapaWebhook"
   return_url = process.env.BASE_WEB_API + "/donateAccepted"

   const toChapa = { public_key, tx_ref, amount, currency, email, first_name,  last_name, title, description, logo, callback_url, return_url, meta, phone_number}
   axios.post(process.env.BACKEND_API + "/payment/chapaPay", toChapa)
   .then((response)=>{
	   if(response.data.status){
		   return res.status(200).json({
			   status: "success",
			   result: {
				   msg: response.data.result.msg,
				   data: response.data.result.data
			   }
		   })
	   }
   }).catch((error) => {
		console.log(error.response.data)
		res.status(400).json({
			status: "error",
			result: {
				msg: error.response.data.result.msg
			}
		})
   })
})



bot.start(home);

bot.action("home", home);
bot.action("login", login);
bot.action("signup", signup);
bot.action("about_us", aboutUs);

const serviceProvider = new ServiceProvider();
bot.action("sp_logout", serviceProvider.logout);
bot.action("y_sp_logout", serviceProvider.yesLogout);
bot.action("n_sp_logout", serviceProvider.noLogout);
bot.action("reject_stud_request", serviceProvider.rejectStudRequest);
bot.action("y_reject_stud_request", serviceProvider.yesRejectStudRequest);
bot.action("n_reject_stud_request", serviceProvider.noRejectStudRequest);

bot.catch((err, ctx) => {
	console.error("Error occured in bot : ", err)
})

const admin = new Admin();
const student = new Student();

bot.launch();
