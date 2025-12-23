const mongoose = require('mongoose');

const mongo_url =  process.env.MONGO_CONN;

mongoose.connect(mongo_url)
    .then(()=> {
        console.log('db is working...')
    })
    .catch((err)=>{
        console.log('mongoDB Connection Error:', err);
    })
