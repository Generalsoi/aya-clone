import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const Flutterwave = require('flutterwave-node-v3');
const twilio = require('twilio');
const axios = require("axios");
const admin = require('firebase-admin');


admin.initializeApp();
const axiosinstance: any = axios.create({
    headers: {'Access-Control-Allow-Origin': '*','Authorization':'Basic bWFpbHRvYXlhOUBnbWFpbC5jb206MjgxMTE5OTQ='},
    baseURL: "https://vtpass.com/api"//"https://sandbox.vtpass.com/api"
})

const client = new twilio("AC7a900b2dff4cb9ff03b88bad21a1e5cd", "2dfc051b2ae446bf28ca55387b5c3a98");
const flw = new Flutterwave("FLWPUBK_TEST-351dd01dec710a2ffd31d615fbd2c783-X", "FLWSECK_TEST-41359ee595a0022b0f0c50c8e82129cf-X");
//const flw = new Flutterwave("FLWPUBK-38626af23dbc1835ba40010a382ce254-X", "FLWSECK-c148d536910a9a9703c849c70509b7ad-X");
const db = admin.firestore();



export const helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});


export const buyAirtime = functions.https.onRequest((request,response) => {
    response.send("Hello buy airtime!");
})


export const validateMeter = functions.https.onRequest((request,response) => {
    let requestBody = request.body
    axiosinstance.post("merchant-verify",{
        billersCode:requestBody.meterNumber,//"0124000937787",
        serviceID:requestBody.serviceID,//"portharcourt-electric",
        type:requestBody.type//"prepaid"
    })
    .then((res:any) => response.status(200).send(res.data))
    .catch((e:any) => response.status(400).send(e.message))
})

export const buyPower = functions.https.onRequest((request,response) => {
    let requestBody = request.body
    db.collection("transactions").doc(requestBody.txref).get().then((doc:any) => {
        functions.logger.info("AYA","returned from transaction fetch: "+ doc.exists)
        if(doc.exists){
            if(doc.data().status == "successful" ) response.status(400).send("Unable to complete this operation because value has already been retrieved")
        }else{
            flw.VerifyTransaction.verify({txref:requestBody.txref}).then((res:any) => {
                if(res.status!="success")response.status(400).send("transaction not found")
                if(res.data.amount==requestBody.amount&&res.data.currency==requestBody.currency){
                    axiosinstance.post("pay",{
                        request_id:requestBody.txref,//"15536627839",
                        billersCode:requestBody.meterNumber,//"0124000937787",
                        serviceID:requestBody.serviceID,//"portharcourt-electric",
                        variation_code:requestBody.type,//"prepaid",
                        amount:requestBody.amount,//"100",
                        phone:requestBody.phoneNumber//"08131058329"
                    })
                    .then((res:any) => {
                        const transaction = {
                            amount:requestBody.amount,
                            meterNumber:requestBody.meterNumber,
                            serviceID:requestBody.serviceID,
                            type:requestBody.type,
                            phone:requestBody.phoneNumber,
                            messageId:""
                        }
                        if(res.data.code=="000"){
                            sendSMS(res.data.purchased_code,requestBody.phoneNumber)
                            .then((messageSID:string) =>{
                                transaction.messageId = messageSID
                                response.status(200).send({billData:res.data,messageDelivered:true,messageId:messageSID})
                            })
                            .catch((e:any) => response.status(400).send({billData:res.data,messageDelivered:false,messageId:e.message}))
                        }else{
                            response.status(400).send(res.data)
                        }
                    })
                    .catch((e:any) => response.status(400).send(e.message))
                }
                else{
                    response.status(400).send("unable to verify this transaction")
                }
            })
            .catch((e:any) => {
                response.status(400).send(e)
            })
        }
    })
})


export const getStates = functions.https.onRequest((request,response) => {
    response.status(200).send(discosByState)
})


function sendSMS(body:string,phoneNumber:string):Promise<string>{
    return new Promise((resolve,reject) => {
        client.messages.create({
            body: body,
            to: phoneNumber,  // Text this number
            from: 'AYA' // From a valid Twilio number
        })
        .then((message:any) => {
            resolve(message.sid)
        })
        .catch((e:any) => {
            reject()
        })
    })
}

/*
function generateTransactionReference()
{
    var max = 8
    var min = 6
    var passwordChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var randPwLen = Math.floor(Math.random() * (max - min + 1)) + min;
    var randPassword = Array(randPwLen).fill(passwordChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    return "AYA-"+randPassword;
}
*/


const discosByState =[
    {id:1,state:"ABUJA",discoServiceId:"abuja-electric",altServiceId:""},
    {id:2,state:"KOGI",discoServiceId:"abuja-electric",altServiceId:"IBEDC"},
    {id:3,state:"NIGER",discoServiceId:"abuja-electric",altServiceId:"IBEDC"},
    {id:4,state:"NASSARAWA",discoServiceId:"abuja-electric",altServiceId:""},

    {id:5,state:"KANO",discoServiceId:"kano-electric",altServiceId:""},
    {id:6,state:"KATSINA",discoServiceId:"kano-electric",altServiceId:""},
    {id:7,state:"JIGAWA",discoServiceId:"kano-electric",altServiceId:""},

    {id:8,state:"KADUNA",discoServiceId:"kaduna-electric",altServiceId:""},
    {id:9,state:"KEBBI",discoServiceId:"kaduna-electric",altServiceId:""},
    {id:10,state:"SOKOTO",discoServiceId:"kaduna-electric",altServiceId:""},
    {id:11,state:"ZAMFARA",discoServiceId:"kaduna-electric",altServiceId:""},

    {id:12,state:"OYO",discoServiceId:"ibadan-electric",altServiceId:""},
    {id:13,state:"OGUN",discoServiceId:"ibadan-electric",altServiceId:""},
    {id:14,state:"OSUN",discoServiceId:"ibadan-electric",altServiceId:""},
    {id:15,state:"KWARA",discoServiceId:"ibadan-electric",altServiceId:""},
    {id:16,state:"EKITI",discoServiceId:"ibadan-electric",altServiceId:""},

    {id:17,state:"BAUCHI",discoServiceId:"jos-electric",altServiceId:""},
    {id:18,state:"BENUE",discoServiceId:"jos-electric",altServiceId:""},
    {id:19,state:"GOMBE",discoServiceId:"jos-electric",altServiceId:""},
    {id:20,state:"PLATEAU",discoServiceId:"jos-electric",altServiceId:""},

    {id:21,state:"RIVERS",discoServiceId:"portharcourt-electric",altServiceId:""},
    {id:22,state:"BAYELSA",discoServiceId:"portharcourt-electric",altServiceId:""},
    {id:23,state:"CROSS-RIVER",discoServiceId:"portharcourt-electric",altServiceId:""},
    {id:24,state:"AKWA-IBOM",discoServiceId:"portharcourt-electric",altServiceId:""},

    {id:20,state:"LAGOS-IKEJA",discoServiceId:"ikeja-electric",altServiceId:""},
    {id:20,state:"LAGOS-EKO",discoServiceId:"eko-electric",altServiceId:""},
]