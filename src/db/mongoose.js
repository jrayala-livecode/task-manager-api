const mongoose = require('mongoose')
require('mongoose')

mongoose.connect(`mongodb://${process.env.MONGODB_URL}/task-manager-api` , {
    useNewUrlParser: true,
    useCreateIndex: true
})