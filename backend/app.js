const express = require('express');
const app = express();
const port = 3000;

const users = require('./routes/userRoutes');

// Routes
app.use('/', users);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
