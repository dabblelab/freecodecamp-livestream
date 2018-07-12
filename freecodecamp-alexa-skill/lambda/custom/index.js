/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const mediumJSONFeed = require('medium-json-feed');
const qa = require('./modules/qa.js');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    let speechText = `Hello, welcome to the free code camp skill. Would you like to learn about Free Code Camp, hear about our most recent medium post, or get answers to frequently asked questions?`;
    let promptText = `Would you like to learn more about Free Code Camp, hear about our most recent medium post, or get answers to frequently asked questions?`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(promptText)
      .withSimpleCard('Free Code Camp', speechText)
      .getResponse();
  },
};

const RecentArticlesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecentArticlesIntent';
  },
  async handle(handlerInput) {
    let speechText = `I can't find any recent articles`;
    let promptText = `I can also provide answers to frequently asked questions or tell you more about free code camp. Which would you like?`;
    await mediumJSONFeed('free-code-camp/latest')
      .then(data => {
        //console.log(JSON.stringify(data))
        speechText = `The most recent article posted on Medium for Free Code Camp is titled: ${data.response[0].title} ${(data.response[0].subtitle) ? true : ''}. It's been recommended ${(data.response[0].recommends) ? true : 0} times.`;
      })
      .catch(err => {
        //console.log(JSON.stringify(err))
      });

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(promptText)
      .withSimpleCard('Articles', speechText)
      .getResponse();
  },
};

const KnowledgeBaseIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'KnowledgeBaseIntent';
  },
  async handle(handlerInput) {

    if (handlerInput.requestEnvelope.request.intent.slots.question.resolutions) {
      let resolution = handlerInput.requestEnvelope.request.intent.slots.question.resolutions.resolutionsPerAuthority[0];

      if (resolution.status.code === "ER_SUCCESS_MATCH") {
        let id = resolution.values[0].value.id;
        let speechText = 'Sorry I don\'t know that question';
        await qa.getQuestionById(id).then(function(data){
          let answer = data[0].answer;
          let prompt = data[0].prompt;
    
          speechText = `${answer} ${prompt}`;
    
        }, function(err){
          speechText = "There was a problem";
        });
  
        handlerInput.responseBuilder
        .speak(speechText)
        .reprompt('Ask another question.');
  
      } else {
        //TODO: capture new questions and send notification
        let speechText = 'Sorry I don\'t know. I\'ve sent your question to one of my human co-workers who can teach me the answer. Please ask me again tomorrow and hopefully I\'ll have an answer for you then.';
  
        handlerInput.responseBuilder
          .speak(speechText);
      }
    } else {
      //prompt for a question
      handlerInput.responseBuilder
      .speak(`Ask me a question like: what is free code camp?`)
      .reprompt('Ask me a question.');
    }
 
    return handlerInput.responseBuilder
      .getResponse();
  },
};

const LiveStreamsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LiveStreamsIntent';
  },
  handle(handlerInput) {
    const speechText = `This functionality is coming soon. Please try again another day. Thanks!`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Live Streams', speechText)
      .getResponse();
  },
};

const HelloIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloIntent';
  },
  handle(handlerInput) {
    //const speechText = 'Hello, what is your name?';
    const nameSlot = handlerInput.requestEnvelope.request.intent.slots.name.value;
    const speechText = `Hello ${nameSlot}. It's nice to meet you.`;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Live Streams', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(`There was an error. The error was: ${error.message}`)
      .reprompt('Sorry about that error. Would you like to learn more about Free Code Camp, hear about our most recent medium post, or get answers to frequently asked questions?')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    RecentArticlesIntentHandler,
    KnowledgeBaseIntentHandler,
    HelloIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
