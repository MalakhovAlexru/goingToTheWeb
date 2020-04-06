const express = require('express');

const app = express();

app.use(express.json({extended:true}));

app.use('/', require('./src/routes/basic.routes'));

const PORT = 5555;

app.listen(PORT, () => console.log(`app has been started on port ${PORT}`));