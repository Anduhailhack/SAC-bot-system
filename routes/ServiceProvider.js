const { Markup } = require("telegraf");
const { isEmail } = require("validator");
const axios = require("axios");
const {home} = require("./General")
const { db } = require("../database/Mongo")
require("dotenv").config();

const ServiceProvider = function (bot) {
	this.bot = bot;
};

ServiceProvider.prototype.home = async function (userId, f_name) {
	this.bot.telegram.sendMessage(userId, 
		`Welcome Home ${f_name}, You have logged in successfully! \n You would be able to do your Service Provider Operation From here!`,
		{
			parse_mode: "HTML",
			reply_markup : {
				inline_keyboard :[
					[
						{
							text: "🤕 Check patient requests",
							web_app : {
								url : process.env.BASE_WEB_API + "/sp/check_requests",
							}
						},
					],
					[
						{
							text: "📆 Check Appointments",
							web_app : {
								url : process.env.BASE_WEB_API + "/sp/check_appointments",
							}
						},
					],
					[
						{
							text: "📆🖊 Set appointments",
							web_app : {
								url : process.env.BASE_WEB_API + "/sp/set_appointments",
							}
						},
					],
					[
						{
							text: "Logout",
							callback_data : "sp_logout"
						},
					],
				]
			}
		}
	)
};

ServiceProvider.prototype.logout = async function (ctx){
	ctx.reply("Are you sure, you want to logout ?",
	{
		reply_markup : {
			inline_keyboard : [
				[
					{text : "👍 Yea", callback_data : "y_sp_logout"},
					{text : "🙅 Nop", callback_data : "n_sp_logout"},
				]
			]
		}
	})
}

ServiceProvider.prototype.yesLogout = function (ctx){
	db.removeSesseion(`${ctx.from.id}:${ctx.from.id}`, async (res)=>{
		let k = 0;
		for(let i = 0; i <= 10; i++ ){
			k =  (ctx.message && ctx.message.message_id) ? ctx.message.message_id - 1 : ctx.update.callback_query.message.message_id - i;
			try {
				await ctx.deleteMessage(k)
			} catch (error) {
			}
		}
		home(ctx)
	});
}

ServiceProvider.prototype.noLogout = async function (ctx){
	try {
		ctx.deleteMessage()
	} catch (error) {
		console.log(error);
	}
}

ServiceProvider.prototype.rejectStudRequest = async function (ctx) {
	
	ctx.reply("Are you sure, you want to reject this request ?",
	{
		reply_markup : {
			inline_keyboard : [
				[
					{text : "👍 Yea", callback_data : "y_reject_stud_request"},
					{text : "🙅 Nop", callback_data : "n_reject_stud_request"},
				]
			]
		}
	})
	
}

ServiceProvider.prototype.yesRejectStudRequest = function (ctx){
	db.removeSesseion(`${ctx.from.id}:${ctx.from.id}`, async (res)=>{
		let k = 0;
		for(let i = 0; i <= 2; i++ ){
			k =  (ctx.message && ctx.message.message_id) ? ctx.message.message_id - 1 : ctx.update.callback_query.message.message_id - i;
			try {
				await ctx.deleteMessage(k)
			} catch (error) {
			}
		}
	});
}

ServiceProvider.prototype.noRejectStudRequest = async function (ctx){
	try {
		ctx.deleteMessage()
	} catch (error) {
		console.log(error);
	}
}
/*
ServiceProvider.prototype.login = function (ctx, data) {
	ctx.sendChatAction("typing");
	ctx.session.logging_in = true
	if (data.email && isEmail(data.email))
		axios
			.post(process.env.API + "/service-provider/login", {
				email: data.email,
			})
			.then((response) => {
				if (response.data.status && response.data.status == "success") {
					ctx.reply(
						`${response.data.result.msg} please click on ✅ verify token.`,
						Markup.keyboard([ 
							[
								{
									text: "✅ Verify token",
									web_app: {
										url: process.env.BASE_WEB_API + "/projects/web-app/sp_verify.html",
									},
								},
							],
							[
								{
									text: "« back to login",
									callback_data: "login",
								},
							],
							[
								{
									text: "« back to home",
									callback_data: "home",
								},
							]
						]).oneTime()
					);
					
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.data && error.data.status && error.data.status == "unauthorized")
				{

				}
			});
};

ServiceProvider.prototype.verify = function (ctx, data) {
	ctx.sendChatAction("typing");

	if (ctx.session && ctx.session.logging_in && data && data.token){
		axios
			.post(process.env.API + "/service-provider/verify", {
				token: data.token,
			})
			.then((response) => {
				if (
					response.data &&
					response.data.status &&
					response.data.status == "success"
				) {
					ctx.session.logging_in = false
					ctx.session.token = response.data.result.token;
					ctx.session.role = response.data.result.role;
					ServiceProvider.prototype.home(ctx);
				} else if (
					response.data &&
					response.data.status &&
					response.data.status == "unauthorized"
				) {
					ctx.session.logging_in = false
					ctx.reply(response.data.result.msg); //probably more options like back button
				}
			})
			.catch((error) => {});
	}else {
		ctx.reply("You are unauthorized, to do that. /start", {
			reply_markup: {
				keyboard : [[]]
			}
		})
	}
};

ServiceProvider.prototype.signup = function () {};

ServiceProvider.prototype.setAppointment = function () {
	//TODO: Pushing appointments to backend
};

ServiceProvider.prototype.getAppointments = function (ctx) {
	//TODO: Get appointment from backend
	try{
		ctx.deleteMessage()
	}catch(err)
	{

	}

	ctx.reply("Hello There, the test is working");
};

ServiceProvider.prototype.getPatientRequests = function (ctx) {
	try{
		ctx.deleteMessage()
	}catch(err)
	{

	}

	ctx.reply("Hello There, the test is working");
	if (
		!ctx.session ||
		!ctx.session.token ||
		!ctx.session.role ||
		ctx.session.role != process.env.SP_ROLE
	) {
		//TODO: Respond with unauthorized
	} else {
		//TODO: Try getting patient request from backend
	}
};
*/
//TODO: more functions maybe
module.exports = { ServiceProvider };
