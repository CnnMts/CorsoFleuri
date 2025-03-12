const express = require('express');
const axios = require('axios');
const app = express();
const port = 8082;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/php', async (req, res) => {
  try {
    console.log('Sending request to PHP server...');
    const response = await axios.get('http://nginx:8083/index.php');
    console.log('Response from PHP server:', response.data);
    res.send(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error setting up the request:', error.message);
      res.status(500).send('Error setting up the request');
    }
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
