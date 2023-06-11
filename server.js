const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

//custom middleware
app.use(logger);

//apply cors
app.use(cors(corsOptions));

//built-in middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//server static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routers/root'));
app.use('/employees', require('./routers/api/employees'));

//This should be at the end of all request http verb
//If none of the above HttpVerbs works then come here
app.all('/*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')){
        res.json({error: "404 Not found"});
    }
    else{
        res.type('txt').send('404 Not Found');
    }    
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

