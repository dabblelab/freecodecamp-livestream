/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const mediumJSONFeed = require('medium-json-feed');

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
    HelloIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
