//index.js

var express = require('express');
var https = require('https');
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// The dashbot Bot Key you created above goes here:
var dashbotKey = 'EygNprCRzCkSAAUb3pugnLQITW1WEIOOn7NS05bA'

// Initialize dashbot.io
var dashbot = require('dashbot')(dashbotKey).facebook;

// Facebook Required Variables

// The validation_token is a string you create.
// You will enter this string on the Facebook bot setup page later.
// It's used to validate your bot with Facebook.
var validation_token = '375538026218163';

// The page_token is from Facebook.
// It's the token of your Facebook Page your bot is associated with.
// If you don't already know it, leave it blank for now - you can find it when setting up on Facebook next.
// Remember to put it in here after the Facebook setup
var page_token = 'EAAFVjMKnArMBAEdNgdwdMZALM1mQcOCCcXjZBfLUAqI0Sg5ZCJHmZBlv4jZB2oMxe0cEbg8ECfRDGMT8mf0maBUZACqnfjSqt8adRX7cc9ZC3ZCtFatIZAOQ7gIWYUOjw3ZBakLMC0RGQXbF3aQOXFychsDtZCr9RZAtq4ztDZBBZC02c8bgZDZD';

// The following are needed to enable parsing of the body sent to the webhook
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false})

// A place holder for the root of your app
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Webhook handling

// Handle the bot validation step from Facebook
// FB will send the validation_token you created to validate the bot
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === validation_token) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

// Handle messages posted to the bot
app.post('/webhook/', jsonParser, function (req, res) {
  if(req.body) {

    // Log incoming message to dashbot.io
    dashbot.logIncoming(req.body);

    if(req.body.entry){
      // loop through entries - a post can have multiple
      req.body.entry.forEach(function(entry){

      if(entry.messaging){
        // loop through messages - an entry can have multiple
        entry.messaging.forEach(function(event){
          // Get sender id to be able to message back
          let sender = event.sender.id;

          // Handle messages

          if(event.postback){
            // Handle postback type messages
            let text = JSON.stringify(event.postback);
            sendTextMessage(sender, 'Postback received: ' + text.substring(0,200), page_token);
          }
          else if(event.message && event.message.text){
            // Handle text messages sent in
            let text = event.message.text;
            if(text === 'Template'){
              // Send a template response when user messages "Template"
              sendTemplateMessage(sender);
            }
            else {
              // Echo text message received back to the user
              sendTextMessage(sender, 'Text received: ' + text.substring(0,200));
            }
          }
        })
      }
      })
    }
  }
  res.sendStatus(200);
});


// Method to send text messages to the user
function sendTextMessage(sender, text) {

  // The message to be sent
  messageData = {
    text:text
  }

  // Build the request object to send the message to the user
  const requestData = {
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:page_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }


  // Send message
  request(requestData, function(error, response, body) {

    // Log outgoing message to dashbot.io
    dashbot.logOutgoing(requestData, response.body);

    // Handle error
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

// Method to send a sample template message
function sendTemplateMessage(sender) {

  // The message to be sent - see Facebook messegner API docs for template fields
  messageData = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [{
          'title': 'First card',
          'subtitle': 'Element #1 of an hscroll',
          'image_url': 'http://messengerdemo.parseapp.com/img/rift.png',
          'buttons': [{
            'type': 'web_url',
            'url': 'https://www.messenger.com/',
            'title': 'Web url'
          }, {
            'type': 'postback',
            'title': 'Postback',
            'payload': 'Payload for first element in a generic bubble',
          }],
        },{
          'title': 'Second card',
          'subtitle': 'Element #2 of an hscroll',
          'image_url': 'http://messengerdemo.parseapp.com/img/gearvr.png',
          'buttons': [{
            'type': 'postback',
            'title': 'Postback',
            'payload': 'Payload for second element in a generic bubble',
          }],
        }]
      }
    }
  };

  // Build the request object to send the template message to the user
  const requestData = {
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:page_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }


  // Send message
  request(requestData, function(error, response, body) {

    // Log outgoing message to dashbot.io
    dashbot.logOutgoing(requestData, response.body);

    // Handle error
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

// Enable bot to listen on http and https
http.createServer(app).listen(80);
https.createServer(app).listen(443)