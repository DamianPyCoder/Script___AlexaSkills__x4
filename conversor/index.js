const Alexa = require('ask-sdk-core');
const axios = require('axios');

const ConvertCurrencyHandler = {
  async canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ConvertCurrencyIntent'
    );
  },
  async handle(handlerInput) {
    const { amount } = handlerInput.requestEnvelope.request.intent.slots;

    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/EUR`
      );
      const exchangeRate = response.data.rates.USD;
      const convertedAmount = amount.value * exchangeRate;

      const speechText = `${amount.value} euros equivale a ${convertedAmount.toFixed(
        2
      )} dólares.`;

      return handlerInput.responseBuilder.speak(speechText).getResponse();
    } catch (error) {
      console.error('Error:', error);
      const speechText =
        'Lo siento, ha ocurrido un error al realizar la conversión. Por favor, intenta nuevamente más tarde.';
      return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(ConvertCurrencyHandler)
  .lambda();
