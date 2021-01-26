////////////////////////////////////////////////////////
////// Buying electricity function/ api call ///////////
////////////////////////////////////////////////////////


////////////////////////////////////
//variable declarations to be used//
////////////////////////////////////
const userMeterDetails = document.getElementById("form-body");
const checkOut = document.getElementById("tab-form")
const transactionSuccessful = document.getElementById("payment-details")
let amount = 0
let serviceId = ""
let meterNo = ""
let phoneNo = ""
let transactionRef = ""



//////////////////////////////////////
//function to validate user entries.//
//////////////////////////////////////
userMeterDetails.addEventListener("submit", async function (e){
    e.preventDefault();

    meterNo = document.getElementById("meter-no").value
    const distCompany = document.getElementById("dist-company")
    serviceId = distCompany.options[distCompany.selectedIndex].id
    amount = document.getElementById("amount").value
    phoneNo = document.getElementById("phone").value
    
    fetch("https://us-central1-ayamain-19ae3.cloudfunctions.net/validateMeter", {
        method: "POST",
        body: JSON.stringify({
            meterNumber: `${meterNo}`,
            serviceID: `${serviceId}`,
            type: "prepaid"
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }).then(response => {
        if (!response.ok){
            throw Error("Error")
        } else{
            return response.json()
        }
    }).then(data => {
        console.log(data)
        let customerName = data.content.Customer_Name
        let address = data.content.Address
        let meterNumber = data.content.MeterNumber
        //to render the response from the api endpoint on another div
        function renderResponse(){
            const userDetails = document.querySelector("#user-details-entered")
            userDetails.innerHTML = "Name: " + customerName + "<br> <br> Address: " + address + "<br> <br> Meter Number: " + meterNumber +
            "<br> <br> Amount: " + amount + "NGN <br> <br>"
        };
        renderResponse()
        userMeterDetails.style.display = "none";
        checkOut.style.display = "block";
    }).catch (function (error){
        console.error(error);
    })
})



/////////////////////////////////////
/////////////////////////////////////
//FUNCTIONS ARE DEFINED HERE BELOW://
/////////////////////////////////////
/////////////////////////////////////

////////////////////////////
//render response function//
////////////////////////////
/*function renderResponse() {
    const userDetails = document.querySelector("#user-details-entered")
    let meterNumber = data.content.MeterNumber
    let customerName = data.content.Customer_Name
    let address = data.content.Address
    
    userDetails.innerHTML = `Name : ${customerName}`
    
}*/





////////////////////////////////////////////////////////////
//make payment function to load up flutter wave interface.//
////////////////////////////////////////////////////////////


function makePayment() {
    transactionRef = generateTransactionReference()
    FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-53617ba2370656cbdc6b42012f8a9f32-X",
    tx_ref: transactionRef,
    amount: amount,
    currency: "NGN",
    country: "NG",
    payment_options: "card, mobilemoneyghana, ussd",
    meta: {
        consumer_id: 23,
        consumer_mac: "92a3-912ba-1192a",
    },
    customer: {
        email: "user@gmail.com",
        phone_number: "08102909304",
        name: "yemi desola",
    },
    callback: function (data) {
        console.log(data);
        buyPower();
    },
    onclose: function() {
        // close modal
    },
    customizations: {
        title: "Aya",
        description: "Payment for utility bills",
        //logo: "https://assets.piedpiper.com/logo.png",
    },
    });
}



//////////////////////////
//function to buy power //
//////////////////////////
function buyPower(){

    fetch("https://us-central1-ayamain-19ae3.cloudfunctions.net/buyPower", {
        method: "POST",
        body: JSON.stringify({
            txref: `${transactionRef}`,
            amount: `${amount}`,
            currency: "NGN",
            meterNumber: `${meterNo}`,
            type: "prepaid",
            serviceID: `${serviceId}`,
            phoneNumber: `+234${phoneNo}`,
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }).then(response => {
        if (!response.ok){
            throw Error("Error")
        }
        return response.json();
    }).then(data => {
        console.log(data)
        let token = data.billData.Token
        let unitsPurchased = data.billData.Units
        function renderData(){
            const transactionStatus = document.querySelector("#successful-payment")
            transactionStatus.innerHTML = "<p>Payment Successful. Transaction details have been sent to your mail</p>"
            + "<br> <p>Here is your token: </p> <br>" + "Token: " + token + "<br> Units Purchased: " + unitsPurchased 
            + "<br> <br>"
        }

        renderData()
        userMeterDetails.style.display = "none";
        checkOut.style.display = "none";
        transactionSuccessful.style.display = "block";
    }).catch(function (e){
        console.error(e);
    })
}



//////////////////////////////////
//generate transaction reference//
//////////////////////////////////
function generateTransactionReference()
{
    var max = 8
    var min = 6
    var passwordChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var randPwLen = Math.floor(Math.random() * (max - min + 1)) + min;
    var randPassword = Array(randPwLen).fill(passwordChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    return "AYA-"+randPassword;
}