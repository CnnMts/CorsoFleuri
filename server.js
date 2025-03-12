const express = require('express');
const axios = require('axios');
const app = express();
const port = 8082;

// Fonction asynchrone pour effectuer la requête HTTP
async function fetchDataFromPHP() {
  try {
    console.log('Sending request to PHP server...');
    const response = await axios.get('http://nginx:8083/index.php');
    console.log('Response from PHP server:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response from PHP server:', error.response.status, error.response.data);
      throw new Error('Error response from PHP server');
    } else if (error.request) {
      console.error('No response received from PHP server:', error.request);
      throw new Error('No response received from PHP server');
    } else {
      console.error('Error setting up the request:', error.message);
      throw new Error('Error setting up the request');
    }
  }
}

// Définir la route en utilisant la fonction
app.get('/php', async (req, res) => {
  try {
    const data = await fetchDataFromPHP();
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Appeler la fonction et stocker le résultat dans une variable
(async () => {
  try {
    const test = await fetchDataFromPHP();
    console.log('Data from PHP server:', test);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
})();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
