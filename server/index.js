const express = require('express');
const app = express();
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema.js'); // Your GraphQL schema definition

app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true // This enables the GraphiQL tool for easy testing and exploration
}));

app.listen(5000, () => {
    console.log('Server has started on port 5000');
});
