'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = process.env.ALEXA_APP_ID;
const Trello = require('node-trello');
const t = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);
const handlers = {
  'LaunchRequest': function() {
    this.emit('GetTrello');
  },
  'GetTrello': function() {
    callDoingTasks().then((result) => {
      this.response.speak(result);
      this.emit(':responseReady');
    }).catch((err) => {
      this.response.speak('失敗しました');
      this.emit(':responseReady');
    });
  },
  'AMAZON.HelpIntent': function() {
    const speechOutput = '利用するには、「トレロのタスクを教えて」と言ってください';
    const reprompt = 'どうしますか？';
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak('終了します');
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function() {
    this.response.speak('終了します');
    this.emit(':responseReady');
  },
};

module.exports.getTasks = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

function callDoingTasks() {
  return new Promise((resolve, reject) => {
    t.get(`/1/lists/${process.env.TRELLO_LIST_ID}/cards`, (err, data) => {
      if (err) {
        reject(err);
      }
      const names = [];
      data.forEach((element) => {
        names.push(element.name);
      });
      resolve(names.join('、'));
    });
  });
};
