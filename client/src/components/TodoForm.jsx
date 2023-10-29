import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_TODO } from "../graphql/mutations"  // Import GET_TODOS query
import { GET_TODOS } from "../graphql/Queries";

function TodoForm() {
    const [text, setText] = useState('')
    const [addTodo, { error }] = useMutation(ADD_TODO, {
        update(cache, { data: { addTodo } }) {
            const { todos: existingTodos } = cache.readQuery({ query: GET_TODOS });
            const updatedTodos = [...existingTodos, addTodo];
            cache.writeQuery({
                query: GET_TODOS,
                data: { todos: updatedTodos },
            });
        },
    });

    if (error) {
        console.log(error)
    }

    const handleClick = () => {
        addTodo({
            variables: {
                description: text,
            }
        });
        setText('');
    }

    return (
        <div>
            <input 
                placeholder="Enter todos ..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleClick}>Add</button>
        </div>
    )
}

export default TodoForm;
