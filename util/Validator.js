const crypto = require("crypto")

function isEmail(email) {
    // check for aau.edu.et domain 
	return /^[\w]+([\.-]?[\w]+)*@aau\.edu\.et$/.test(email);
}

/*
const isValidEmail = isEmail("james_brown@abc.edu.e");
console.log(isValidEmail);
*/

function isPhoneNumber(phoneNumber) {
    // check for Telecom or Safaricom phone number
	return /^(?:\+251|0)[97]\d{8}$/.test(phoneNumber);
}

/*
const isValidPhoneNumber = isPhoneNumber("+251712345678");
console.log(isValidPhoneNumber);
*/

function isName(name){
	let isValid = (name.length > 3);
	return isValid && /^[a-zA-Z]+$/.test(name)
}

function isValidInitData (telegramInitData){
    const urlParams = new URLSearchParams(telegramInitData);

    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
        dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const secret = crypto.createHmac('sha256', 'WebAppData').update(process.env.BOT_TOKEN || '');
    const calculatedHash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');
    return calculatedHash == hash;
}

module.exports = {isEmail, isName, isPhoneNumber, isValidInitData}