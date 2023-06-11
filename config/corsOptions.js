//apply cors
//use this corsOptions only when you want restricted - most of the time
//use !origin in if block only when in development environment. 
//remove in production
const whileList = [
                    'https://www.yoursite.com', 
                    'http://127.0.0.1:5500',
                    'http://localhost:3500'];

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

module.exports = corsOptions;