///////////////////////
// Responsive navbar //
///////////////////////
const  hamburger = document.getElementById('hamburger');
const navUl = document.getElementById('nav-ul');

hamburger.addEventListener('click', () => {
    navUl.classList.toggle('show');
})


///////////////////////
/// Countdown timer ///
///////////////////////
let dateToLaunch = new Date('Jan 20, 2021 12:00:00').getTime();

//set up timer to move every 1 second
let timer = setInterval(move, 1000);

//define move function
function move() {
    let currentTime = new Date().getTime();
    let timeRemaining = dateToLaunch - currentTime;

    if (timeRemaining > 0){
        //algorithm for days left
        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        if (days < 10) {
            days = "0" + days; //to set days less than ten to 0x e.g 04
        }

        //algorithm for hours left
        let hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (hours < 10) {
            hours = "0" + hours; //to set hours less than ten to 0x e.g 04
        }

        //algorithm for mins left
        let mins = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        if (mins < 10) {
            mins = "0" + mins; //to set mins less than ten to 0x e.g 04
        }

        //algorithm for secs left
        let secs = Math.floor((timeRemaining % (1000 * 60)) / (1000));
        if (secs < 10) {
            secs = "0" + secs; //to set secs less than ten to 0x e.g 04
        }

        let time = `${days} : ${hours} : ${mins} : ${secs}`;
        document.querySelector('.countdown').innerText = time;
    }
}