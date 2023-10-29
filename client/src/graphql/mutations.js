import {gql} from '@apollo/client'

export const ADD_TODO = gql`
    mutation($description: String!) {
        addTodo(description: $description) {
            id
            description
        }
    }
`;

export const UPDATE_TODO = gql`
    mutation($id: ID!, $description: String!) {
        updateTodo(id: $id, description: $description) {
            id
            description
        }
    }
`;

export const DELETE_TODO = gql`
    mutation($id: ID!) {
        deleteTodo(id: $id) {
            id
            description
        }
    }
`;