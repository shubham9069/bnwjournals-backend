const mongoose = require('mongoose')

const DBurl = process.env.MONGODB_URL
mongoose.connect(DBurl,{
    // useNewUrlParser: true,
    //  useCreateIndex: true,
    //  useUnifiedTopology: true,
    // useFindAndModify: false
}).then(()=>{
    console.log('Connect successful');

}).catch((err) =>{
    console.error('not successful');
})
