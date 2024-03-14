const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 3010;
const PlayerController = require('./controllers/PlayerController');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const users = require('./routes/userRoutes');

// Routes
app.use('/', users);

// Main page route
app.get('/', (req, res) => {
  // Only greets
  res.send('Bienvenido a la página de inicio');
});

// General error management
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

const prueba = async () => {
  const controller = new PlayerController();
  const result = await controller.selectAll();
  console.log(result);
};
prueba();

/*app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/
