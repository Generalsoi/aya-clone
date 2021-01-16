////////////////////////////////////////////////////////
////// Buying electricity function/ api call ///////////
////////////////////////////////////////////////////////

const userMeterDetails = document.getElementById("form-body");
const payNow = document.getElementById("tab-form")

userMeterDetails.addEventListener("submit", async function (e){
    e.preventDefault();

    const formData = new FormData(userMeterDetails);
    //const formDataOrganized = Object.fromEntries(formData);

    
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        /*body: JSON.stringify({formData
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }*/
    }).then(response => {
        //window.location.assign("./paynow.html")
        userMeterDetails.style.display = "none";
        payNow.style.display = "block";
    }).catch (function (error){
        console.error(error);
    })
})

function makePayment() {
    FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-SANDBOXDEMOKEY-X",
    tx_ref: "hooli-tx-1920bbtyt",
    amount: 54600,
    currency: "NGN",
    country: "NG",
    payment_options: "card, mobilemoneyghana, ussd",
    redirect_url: // specified redirect URL
        "https://callbacks.piedpiper.com/flutterwave.aspx?ismobile=34",
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
    },
    onclose: function() {
        // close modal
    },
    customizations: {
        title: "My store",
        description: "Payment for items in cart",
        logo: "https://assets.piedpiper.com/logo.png",
    },
    });
}