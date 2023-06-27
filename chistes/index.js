const Alexa = require('ask-sdk-core');

const jokes = [
  "Me encantan los mensajes de voz. Yo los detesto. Sí, esos también molan.",
  "¿Qué hace un mudo bailando? Una mudanza.",
  "Hola, busco trabajo. ¿Le interesa de jardinero? ¿Dejar dinero? ¡Si lo que busco es trabajo!",
  "¿Qué le dice una impresora a otra? Esta hoja es tuya o es impresión mía.",
  "¿Qué tal tu primer día de parkour? De futa madfre.",
  "Me acabo de tirar un pedo de esos silenciosos, ¿qué hago? Ahora nada, pero, cuando llegues a casa, cámbiale las pilas al audífono.",
  "Me han despedido. ¿Y qué vas a hacer? Croquetas. Digo con tu vida. Pues comerme unas croquetas.",
  "¿Me da un café con leche corto? Se ha roto la máquina, cambio.",
  "Buenas, quería una camiseta de un personaje inspirador. ¿Gandhi? No, mediani.",
  "¿Sabes por qué no se puede discutir con un DJ? Porque siempre están cambiando de tema."
];

const TellJokeHandler = {
  canHandle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request;
    return (
      intent.name === 'TellJokeIntent' ||
      (intent.name === 'AMAZON.YesIntent' && handlerInput.attributesManager.getSessionAttributes().waitingForJoke)
    );
  },
  handle(handlerInput) {
    const joke = getRandomJoke();
    const speechText = joke + ' ¿Quieres escuchar otro chiste?';

    handlerInput.attributesManager.setSessionAttributes({ waitingForJoke: true });

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('¿Quieres escuchar otro chiste?')
      .getResponse();
  },
};

const YesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const joke = getRandomJoke();
    const speechText = joke + ' ¿Quieres escuchar otro chiste?';

    handlerInput.attributesManager.setSessionAttributes({ waitingForJoke: true });

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('¿Quieres escuchar otro chiste?')
      .getResponse();
  },
};

const NoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    const speechText = 'Vale, ¡hasta luego!';

    handlerInput.attributesManager.setSessionAttributes({ waitingForJoke: false });

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText =
      'Puedes decirme "Alexa, dime un chiste" para escuchar un chiste. También puedes decir "sí" o "no" para seguir escuchando más chistes. ¿En qué puedo ayudarte?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('¿En qué puedo ayudarte?')
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request;
    return (
      intent.name === 'AMAZON.CancelIntent' || intent.name === 'AMAZON.StopIntent'
    );
  },
  handle(handlerInput) {
    const speechText = '¡Hasta luego!';

    handlerInput.attributesManager.setSessionAttributes({ waitingForJoke: false });

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    handlerInput.attributesManager.setSessionAttributes({ waitingForJoke: false });
    return handlerInput.responseBuilder.getResponse();
  },
};

function getRandomJoke() {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    TellJokeHandler,
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .lambda();
