const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyA7pPVCtjiqWdwYucb9Wcwn7LkprXXsXq8');
async function list() {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyA7pPVCtjiqWdwYucb9Wcwn7LkprXXsXq8');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
list();
