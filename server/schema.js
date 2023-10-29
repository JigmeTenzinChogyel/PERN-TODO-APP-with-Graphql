// schema.js
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLSchema } = require('graphql');
const pool = require('./db');

const TodoType = new GraphQLObjectType({
   name: 'Todo',
   fields: () => ({
       id: { type: GraphQLID },
       description: { type: GraphQLString }
   })
});

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       todos: {
           type: new GraphQLList(TodoType),
           resolve(parent, args) {
               return pool.query('SELECT * FROM todo')
                   .then(res => res.rows)
                   .catch(err => {
                       throw err;
                   });
           }
       }
   }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo: {
            type: TodoType,
            args: {
                description: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const { description } = args;
                return pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [description])
                    .then(res => res.rows[0])
                    .catch(err => {
                        throw err;
                    });
            }            
        },
        updateTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                description: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const { id, description } = args;
                return pool.query('UPDATE todo SET description = $1 WHERE id = $2 RETURNING *', [description, id])
                    .then(res => res.rows[0])
                    .catch(err => {
                        throw err;
                    });
            }
        },
        deleteTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const { id } = args;
                return pool.query('DELETE FROM todo WHERE id = $1 RETURNING *', [id])
                    .then(res => res.rows[0])
                    .catch(err => {
                        throw err;
                    });
            }
        }
    }
 });

module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutation
});
