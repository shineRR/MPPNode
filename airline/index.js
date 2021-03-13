const mongoose = require('mongoose')
const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require('./server/graphql/schema');
const bodyParser = require('body-parser');

// App setup
const PORT = 3000;
const app = express();

// Static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(__dirname + "/client/"));

const dbURI = 'mongodb+srv://admin:admin@mpp.zysk6.mongodb.net/mpp-lab?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error))

app.use('/', bodyParser.json(), graphqlHTTP((req, response, graphQLParams) => ({
    schema: schema,
    graphiql: true,
    context:{
        user: req.headers,
    }
})));

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});