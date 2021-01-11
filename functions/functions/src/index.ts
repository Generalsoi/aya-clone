import * as functions from 'firebase-functions';
import { response } from 'express';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

//const Flutterwave = require('flutterwave-node-v3');
var twilio = require('twilio');
var axios = require("axios");

const axiosinstance: any = axios.create({
    headers: {'Access-Control-Allow-Origin': '*','Authorization':'Basic bWFpbHRvYXlhOUBnbWFpbC5jb206MjgxMTE5OTQ='},
    baseURL: "https://vtpass.com/api"//"https://sandbox.vtpass.com/api"
})

//const flw = new Flutterwave("FLWPUBK-38626af23dbc1835ba40010a382ce254-X", "FLWSECK-c148d536910a9a9703c849c70509b7ad-X");
//const flw = new Flutterwave("FLWPUBK_TEST-351dd01dec710a2ffd31d615fbd2c783-X", "FLWSECK_TEST-41359ee595a0022b0f0c50c8e82129cf-X");
const client = new twilio("AC7a900b2dff4cb9ff03b88bad21a1e5cd", "2dfc051b2ae446bf28ca55387b5c3a98");


export const helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});


export const buyAirtime = functions.https.onRequest((request,response) => {
    response.send("Hello buy airtime!");
})


export const validateMeter = functions.https.onRequest((request,response) => {
    axiosinstance.post("merchant-verify",{
        billersCode:"0124000937787",
        serviceID:"portharcourt-electric",
        type:"prepaid"
    })
    .then((res:any) => response.status(200).send(res.data))
    .catch((e:any) => response.status(400).send(e.message))
})

export const buyPower = functions.https.onRequest((request,response) => {
    axiosinstance.post("pay",{
        request_id:"15536627839",
        billersCode:"0124000937787",
        serviceID:"portharcourt-electric",
        variation_code:"prepaid",
        amount:"100",
        phone:"08131058329"
    })
    .then((res:any) => {
        if(res.data.code=="000"){
            sendSMS(res.data.purchased_code,"+2348131058329")
            .then((messageSID:string) => response.status(200).send({billData:res.data,messageDelivered:true,messageId:messageSID}))
            .catch((e:any) => response.status(400).send({billData:res.data,messageDelivered:false,messageId:e.message}))
        }else{
            response.status(400).send(res.data)
        }
    })
    .catch((e:any) => response.status(400).send(e.message))
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