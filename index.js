//buttons dont work

'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))
// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
  res.send("stock-bot is now working.")
})


//yahoo finance

// var yahooFinance = require('yahoo-finance');


// var SYMBOLS = [
//   'NASDAQ:AAPL',
//   'NASDAQ:GOOGL',
//   'NASDAQ:MSFT',
//   'NASDAQ:YHOO',
//   'NYSE:IBM',
//   'NYSE:TWTR'
// ];

// yahooFinance.companyNews({
//   symbols: SYMBOLS
// }, function (err, result) {
//   if (err) { throw err; }
//   _.each(result, function (news, symbol) {
//     console.log(util.format(
//       '=== %s (%d) ===',
//       symbol,
//       news.length
//     ).cyan);
//     if (news[0]) {
//       console.log(
//         '%s\n...\n%s',
//         JSON.stringify(news[0], null, 2),
//         JSON.stringify(news[news.length - 1], null, 2)
//       );
//     } else {
//       console.log('N/A');
//     }
  
  
// });
 

// // Creates the endpoint for our webhook 
// app.post('/webhook', (req, res) => {  
 
//   let body = req.body;

//   // Checks this is an event from a page subscription
//   if (body.object === 'page') {

//     // Iterates over each entry - there may be multiple if batched
//     body.entry.forEach(function(entry) {

//       // Gets the message. entry.messaging is an array, but 
//       // will only ever contain one message, so we get index 0
//       let webhookEvent = entry.messaging[0];
//       console.log(webhookEvent);
//     });

//     // Returns a '200 OK' response to all requests
//     res.status(200).send('EVENT_RECEIVED');
//   } else {
//     // Returns a '404 Not Found' if event is not from a page subscription
//     res.sendStatus(404);
//   }

// });

// // Adds support for GET requests to our webhook
// app.get('/webhook', (req, res) => {

//   // Your verify token. Should be a random string.
//   let VERIFY_TOKEN = "KV029F7g3mn62qe3L3";
    
//   // Parse the query params
//   let mode = req.query['hub.mode'];
//   let token = req.query['hub.verify_token'];
//   let challenge = req.query['hub.challenge'];
    
//   // Checks if a token and mode is in the query string of the request
//   if (mode && token) {
  
//     // Checks the mode and token sent is correct
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
//       // Responds with the challenge token from the request
//       console.log('WEBHOOK_VERIFIED');
//       res.status(200).send(challenge);
    
//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);      
//     }
//   }
// });

// Facebook 
let token = "EAAFVjMKnArMBAEaTFASFCBm5EIveojRpYRmE3ozYJiVSiHBNbt6laylsp2c33CniQZBawfkjYfLkWMSBqd7F9lzelV741AYEirQK11hevSykFlgj5ApEh3nh8YoAzhjvi9ZCGzYI7lK9NFC6yKOF9WxCmsWqvvZBWJiQ58MowZDZD";

app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === "KV029F7g3mn62qe3L3") {
    res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = messaging_events[i]
    let sender = event.sender.id

    if (event.message && event.message.text) {
      let text = event.message.text
      decideMessage(sender, text)
      // sendText(sender, "Text echo: " + text.substring(0, 100))
    }

    if(event.web_url){
      let text = JSON.stringify(event.web_url)
      decideMessage(sender, text)
      continue
         }

    }
  
  res.sendStatus(200)
})

function decideMessage(sender, text1){
  let text = text1.toLowerCase();
  if(text.includes("prices")){
  	sendGenericMessage2(sender)
    //sendButtonMessage2(sender, "Prices")
  }else if (text.includes("company news")){
    sendGenericMessage2(sender)
  }else{
      sendText(sender, "to look at prices or company news press one of the buttons")
     
      sendButtonMessage(sender, "company news")
      sendButtonMessage2(sender, "Prices")
   }

}

function sendGenericMessage(sender){
  let messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Yahoo Finance",
            "image_url":"https://www.timothysykes.com/wp-content/uploads/2016/07/yf.jpg",
            "subtitle":"Check for daily stock news.",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://finance.yahoo.com/",
                "title":"View Yahoo Finance"
              
              }              
            ]      
          }
         ]
        }
      }
    }
      sendRequest(sender, messageData)
      
  }

  function sendGenericMessage2(sender){
  let messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Yahoo Finance",
            "image_url":"https://www.timothysykes.com/wp-content/uploads/2016/07/yf.jpg",
            "subtitle":"Check for daily stock news.",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://finance.yahoo.com/most-active",
                "title":"Stock Prices"
              
              }              
            ]      
          }
         ]
        }
      }
    }
      sendRequest(sender, messageData)
      
  }


function sendButtonMessage(sender, text){
  let messageData = {
    
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons":[
          
          {
            "type":"web_url",
            "url":"https://finance.yahoo.com/",
            "title":"company news",
            "webview_height_ratio": "full",
    		"messenger_extensions": true,  
    		"fallback_url": "https://finance.yahoo.com/"
          }
          
        ]
      }
    }
  }
}

function sendButtonMessage2(sender, text){
  let messageData = {
    
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons":[
          
          {
            "type":"web_url",
            "url":"https://finance.yahoo.com/most-active/",
            "title":"Prices",
            "webview_height_ratio": "full",
    		"messenger_extensions": true,  
    		"fallback_url": "https://finance.yahoo.com/most-active/" 
          }
          
        ]
      }
    }
  }
}

function sendImageMessage(sender){
  let messageData = {
    "attachment":{
      "type": "image",
      "payload":{
        "url": "https://www.timothysykes.com/wp-content/uploads/2016/07/yf.jpg"
      }
    }
  }
}

function sendRequest(sender, messageData){
request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs : {access_token: token},
    method: "POST",
    json: {
      recipient: {id: sender},
      message : messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("sending error")
    } else if (response.body.error) {
      console.log("response body error")
    }
  })
}

function sendText(sender, text) {

  let messageData = {text: text}
  sendRequest(sender, messageData) 
  
}

app.listen(app.get('port'), function() {
  console.log("running: port")
})



//dashbot



// var express = require('express');
// var https = require('https');
// var http = require('http');
// var bodyParser = require('body-parser');
// var request = require('request');
// var app = express();

// // The dashbot Bot Key you created above goes here:
// var dashbotKey = 'EygNprCRzCkSAAUb3pugnLQITW1WEIOOn7NS05bA'

// // Initialize dashbot.io
// var dashbot = require('dashbot')(dashbotKey).facebook;

// // Facebook Required Variables

// // The validation_token is a string you create.
// // You will enter this string on the Facebook bot setup page later.
// // It's used to validate your bot with Facebook.
// var validation_token = '375538026218163';

// // The page_token is from Facebook.
// // It's the token of your Facebook Page your bot is associated with.
// // If you don't already know it, leave it blank for now - you can find it when setting up on Facebook next.
// // Remember to put it in here after the Facebook setup
// var page_token = 'EAAFVjMKnArMBAEdNgdwdMZALM1mQcOCCcXjZBfLUAqI0Sg5ZCJHmZBlv4jZB2oMxe0cEbg8ECfRDGMT8mf0maBUZACqnfjSqt8adRX7cc9ZC3ZCtFatIZAOQ7gIWYUOjw3ZBakLMC0RGQXbF3aQOXFychsDtZCr9RZAtq4ztDZBBZC02c8bgZDZD';

// // The following are needed to enable parsing of the body sent to the webhook
// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({extended:false})

// // A place holder for the root of your app
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// // Webhook handling

// // Handle the bot validation step from Facebook
// // FB will send the validation_token you created to validate the bot
// app.get('/webhook/', function (req, res) {
//   if (req.query['hub.verify_token'] === validation_token) {
//     res.send(req.query['hub.challenge']);
//   }
//   res.send('Error, wrong validation token');
// })

// // Handle messages posted to the bot
// app.post('/webhook/', jsonParser, function (req, res) {
//   if(req.body) {

//     // Log incoming message to dashbot.io
//     dashbot.logIncoming(req.body);

//     if(req.body.entry){
//       // loop through entries - a post can have multiple
//       req.body.entry.forEach(function(entry){

//       if(entry.messaging){
//         // loop through messages - an entry can have multiple
//         entry.messaging.forEach(function(event){
//           // Get sender id to be able to message back
//           let sender = event.sender.id;

//           // Handle messages

//           if(event.postback){
//             // Handle postback type messages
//             let text = JSON.stringify(event.postback);
//             sendTextMessage(sender, 'Postback received: ' + text.substring(0,200), page_token);
//           }
//           else if(event.message && event.message.text){
//             // Handle text messages sent in
//             let text = event.message.text;
//             if(text === 'Template'){
//               // Send a template response when user messages "Template"
//               sendTemplateMessage(sender);
//             }
//             else {
//               // Echo text message received back to the user
//               sendTextMessage(sender, 'Text received: ' + text.substring(0,200));
//             }
//           }
//         })
//       }
//       })
//     }
//   }
//   res.sendStatus(200);
// });


// // Method to send text messages to the user
// function sendTextMessage(sender, text) {

//   // The message to be sent
//   messageData = {
//     text:text
//   }

//   // Build the request object to send the message to the user
//   const requestData = {
//     url: 'https://graph.facebook.com/v2.6/me/messages',
//     qs: {access_token:page_token},
//     method: 'POST',
//     json: {
//       recipient: {id:sender},
//       message: messageData,
//     }
//   }


//   // Send message
//   request(requestData, function(error, response, body) {

//     // Log outgoing message to dashbot.io
//     dashbot.logOutgoing(requestData, response.body);

//     // Handle error
//     if (error) {
//       console.log('Error sending message: ', error);
//     } else if (response.body.error) {
//       console.log('Error: ', response.body.error);
//     }
//   });
// }

// // Method to send a sample template message
// function sendTemplateMessage(sender) {

//   // The message to be sent - see Facebook messegner API docs for template fields
//   messageData = {
//     'attachment': {
//       'type': 'template',
//       'payload': {
//         'template_type': 'generic',
//         'elements': [{
//           'title': 'First card',
//           'subtitle': 'Element #1 of an hscroll',
//           'image_url': 'http://messengerdemo.parseapp.com/img/rift.png',
//           'buttons': [{
//             'type': 'web_url',
//             'url': 'https://www.messenger.com/',
//             'title': 'Web url'
//           }, {
//             'type': 'postback',
//             'title': 'Postback',
//             'payload': 'Payload for first element in a generic bubble',
//           }],
//         },{
//           'title': 'Second card',
//           'subtitle': 'Element #2 of an hscroll',
//           'image_url': 'http://messengerdemo.parseapp.com/img/gearvr.png',
//           'buttons': [{
//             'type': 'postback',
//             'title': 'Postback',
//             'payload': 'Payload for second element in a generic bubble',
//           }],
//         }]
//       }
//     }
//   };

//   // Build the request object to send the template message to the user
//   const requestData = {
//     url: 'https://graph.facebook.com/v2.6/me/messages',
//     qs: {access_token:page_token},
//     method: 'POST',
//     json: {
//       recipient: {id:sender},
//       message: messageData,
//     }
//   }


//   // Send message
//   request(requestData, function(error, response, body) {

//     // Log outgoing message to dashbot.io
//     dashbot.logOutgoing(requestData, response.body);

//     // Handle error
//     if (error) {
//       console.log('Error sending message: ', error);
//     } else if (response.body.error) {
//       console.log('Error: ', response.body.error);
//     }
//   });
// }

// // Enable bot to listen on http and https
// http.createServer(app).listen(80);
// https.createServer(app).listen(443)
