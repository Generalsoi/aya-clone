///////////////////////
// Responsive navbar //
///////////////////////
const  hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('.nav-ul');
const links = document.querySelector(".nav-ul li")

hamburger.addEventListener('click', () => {
    navUl.classList.toggle('show');
})



////////////////////////////////////////////
///// Swap between tabs in form-content/////
////////////////////////////////////////////

/*let tabPanes = document.getElementsByClassName("tab-header")[0].getElementsByTagName("div");

for (let i=0; i < tabPanes.length; i++){
    tabPanes[i].addEventListener('click',  power = function(){
        document.getElementsByClassName("tab-header")
        [0].getElementsByClassName("active")[0].classList.remove('active'); 

    tabPanes[i].classList.add("active");

    document.getElementsByClassName("tab-content")
    [0].getElementsByClassName("active")[0].classList.remove('active');
    document.getElementsByClassName("tab-content")
    [0].getElementsByClassName("tab-body")[i].classList.add('active');
    });
}
*/




