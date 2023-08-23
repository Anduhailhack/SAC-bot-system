require("dotenv").config();

const Student = function (bot) {
    this.bot = bot;
};

const menu_disc = {
	welcome:
		`Welcome Home <b>f_name</b>, you have logged in successfully! You would be able to do your student operations from here!`,
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

Student.prototype.home = function (userId, f_name) {
	console.log(userId, f_name)
    this.bot.telegram.sendMessage(userId, menu_disc.welcome.replace("f_name", f_name),
		{
			parse_mode: "HTML",
			reply_markup : {
				inline_keyboard :[
					[
						{
							text: "📆 Check my appointments",
							web_app : {
								url : process.env.BASE_WEB_API + "/stud/check_appointments",
							}
						},
					],
					[
						{
							text: "🤕 Send requests",
							web_app : {
								url : process.env.BASE_WEB_API + "/stud/send_requests",
							}
						},
					],
					[
						{
							text: "👋 Logout",
							callback_data : "sp_logout"
						},
					],
				]
			}
		}
	)
};

Student.prototype.login = function () {};

Student.prototype.signup = function () {};

module.exports = { Student };
