const Alexa = require('ask-sdk-core');

const ReverseWordHandler = {
  canHandle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request;
    return intent.name === 'ReverseWordIntent';
  },
  handle(handlerInput) {
    const { word } = handlerInput.requestEnvelope.request.intent.slots;
    const reversedWord = reverseString(word.value);

    const speechText = `La palabra invertida es: ${reversedWord}`;

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};

function reverseString(str) {
  return str.split('').reverse().join('');
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder.addRequestHandlers(ReverseWordHandler).lambda();
