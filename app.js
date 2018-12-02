const express = require("express");
const app = express(); 
const compression = require('compression');
const port = process.env.PORT || 8000

// compress all responses
app.use(compression());
//parsers
app.use(express());
app.use(express.json());

// redirector
app.use('/', express.static(`${__dirname}`));

// start server
const server = app.listen(port, function () {
    console.log(`Server listening on port ${port}`)
});
