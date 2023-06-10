const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents')

const PORT = process.env.PORT || 3500;

//custom middleware
app.use(logger);

//apply cors
//use this corsOptions only when you want restricted - most of the time
//use !origin in if block only when in development environment. 
//remove in production
const whileList = ['https://www.yoursite.com', 'http://127.0.0.1:5500','http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whileList.indexOf(origin) != -1 || !origin){
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by cors'));
        }
    },
    OptionsSuccessStatus: 200
}
app.use(cors(corsOptions));

//built-in middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
});

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send(err.message);
})


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

