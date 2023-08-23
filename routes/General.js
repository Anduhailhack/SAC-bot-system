const { Markup } = require("telegraf");
require("dotenv").config();

const menu_disc = {
	login:
		`🗝 <b>Login:</b>\n 
		How would you like to proceed? \n
		Click the following buttons to fill out your credentials.   
		⚠️<em>If it is not openning and you are on telegram proxy but not on VPN, connect your 
		"VPN and try again.</em>`,
	signup:
		`📃 <b>Sign up</b> \n
		How would you like to proceed? \n
		Click the following buttons to fill out your form. \n
		⚠️<em>If it is not openning and you are on telegram proxy but not on VPN, connect your 
		VPN and try again. </em>`,
	home:
		"🏠 <b>Home: </b>",
	about_us: "We are SAC",
	error: "",
};

const home = async function (ctx) {
	// let k = 0;
	// for(let i = 0; i <= 5; i++ ){
	// 	k =  (ctx.message && ctx.message.message_id) ? ctx.message.message_id - 1 : ctx.update.callback_query.message.message_id - i;
	// 	try {
	// 		await ctx.deleteMessage(k)
	// 	} catch (error) {
	// 	}
	// }

	try {
		await ctx.deleteMessage()
	} catch (error) {
	}

	ctx.sendMessage(menu_disc.home, {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[{ text: "🗝 Login", callback_data: "login" }],
				[{ text: "📃 Sign Up", callback_data: "signup" }],
				[{ text: "🧑‍⚕️ About SAC 👨‍⚕️", callback_data: "about_us" }],
			],
		},
	});
};

const login = async function (ctx) {
	// let k = 0;
	// for(let i = 0; i <= 10; i++ ){
	// 	k =  (ctx.message && ctx.message.message_id) ? ctx.message.message_id - 1 : ctx.update.callback_query.message.message_id - i; //ctx.message.message_id - i; //ctx.message.message_id-i;
	// 	try {
	// 		await ctx.deleteMessage(k)
	// 	} catch (error) {
	// 		break;
	// 	}
	// }

	try {
		await ctx.deleteMessage()
	} catch (error) {
	}

	ctx.sendMessage(
		menu_disc.login,{
			parse_mode: "HTML",
			reply_markup : { 
				inline_keyboard :[
					[
						{
							text: "👨‍🎓 Student 🧑‍🎓",
							web_app: {
								url: process.env.BASE_WEB_API + "/stud/login",
							},
						},
					],
					[
						{
							text: "🧑‍⚕️ Service Provider 👨‍⚕️",
							web_app: {
								url: process.env.BASE_WEB_API + "/sp/login",
							},
						},
					],
					[
						{
							text: "💰 I want to donate",
							web_app: {
								url: process.env.BASE_WEB_API + "/donate",
							},
						},
					],
					[{ text: "« back home", callback_data:"home" }],
				]
			}
		}	
	);
};

const signup = async function (ctx) {
	// let k = 0;
	// for(let i = 0; i <= 10; i++ ){
	// 	k =  (ctx.message && ctx.message.message_id) ? ctx.message.message_id - 1 : ctx.update.callback_query.message.message_id - i;
	// 	try {
	// 		await ctx.deleteMessage(k)
	// 	} catch (error) {
	// 	}
	// }

	try {
		await ctx.deleteMessage()
	} catch (error) {
	}

	ctx.sendMessage(menu_disc.signup, {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "👨‍🎓 Student 🧑‍🎓",
						web_app: {
							url: process.env.BASE_WEB_API + "/stud/signup",
						},
					},
				],
				[
					{
						text: "🧑‍⚕️ Service Provider 👨‍⚕️",
						web_app: {
							url: process.env.BASE_WEB_API + "/sp/signup",
						},
					},
				],
				[
					{
						text: "💰 I want to donate",
						web_app: {
							url: process.env.BASE_WEB_API + "/donate",
						},
					},
				],
				[{ text: "« back", callback_data: "home" }]
			],
		},
	});
};

const aboutUs = async function (ctx) {
	try {
		await ctx.deleteMessage();
	} catch (error) {
	}

	ctx.sendMessage(menu_disc.about_us, {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "« back",
						callback_data: "home",
					},
				],
			],
		},
	});
};

const generalError = async function (ctx, error) {
	try {
		await ctx.deleteMessage();
	} catch (error) {
	}

	ctx.replyWithMarkdownV2(error || menu_disc.error, {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "« back",
						callback_data: "home",
					},
				],
			],
		},
	});
};

module.exports = { home, login, signup, aboutUs, generalError };
