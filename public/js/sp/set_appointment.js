const setAppointmentBtn = document.querySelector("#set-appointment")
const setAppointmentCaption = document.getElementById("caption");
setAppointmentCaption.classList.remove("warning");

setAppointmentBtn.addEventListener('click', (event) => {
    setAppointmentBtn.setAttribute('disable', 'disabled')

    let remark = document.getElementById("remark").value;
	let date = document.getElementById("date").value;
	let time = document.getElementById("time").value;
	let place = document.getElementById("place").value;

    if (validate(remark, date, time, place)) {
        
    }
})

function validate(remark, date, time, place) {
    if (!remark) {
        setAppointmentCaption.classList.add('warning')
		setAppointmentCaption.innerText = "Could you write something for the student."
		return false
    }

    if (!date) {
        setAppointmentCaption.classList.add('warning')
		setAppointmentCaption.innerText = "Date must be set."
		return false
    }

    if (!time) {
        setAppointmentCaption.classList.add('warning')
		setAppointmentCaption.innerText = "Time must be set."
		return false
    }

    if (!place) {
        setAppointmentCaption.classList.add('warning')
		setAppointmentCaption.innerText = "Where should the student come?"
		return false
    }

    return true
}