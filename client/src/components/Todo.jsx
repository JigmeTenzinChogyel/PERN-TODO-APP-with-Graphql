import { useQuery} from '@apollo/client'
import { GET_TODOS } from '../graphql/Queries'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { todoState } from '../states/atoms'
import { useMutation } from '@apollo/client'
import { DELETE_TODO, UPDATE_TODO } from '../graphql/mutations'

function Todo() {
    const { error, loading, data } = useQuery(GET_TODOS);
    const [todos, setTodos] = useRecoilState(todoState);
    const [editTodos, setEditTodos] = useState(Array(todos.length).fill(false));
    const [editedDescriptions, setEditedDescriptions] = useState(Array(todos.length).fill(''));

    const [updateTodo] = useMutation(UPDATE_TODO, {
        update(cache, { data: { updateTodo } }) {
            const { todos: existingTodos } = cache.readQuery({ query: GET_TODOS });
            const index = existingTodos.findIndex(todo => todo.id === updateTodo.id);
            const updatedTodos = [...existingTodos];
            updatedTodos[index] = { ...updatedTodos[index], description: updateTodo.description };
            cache.writeQuery({
                query: GET_TODOS,
                data: { todos: updatedTodos },
            });
        },
    });

    const [deleteTodo] = useMutation(DELETE_TODO, {
        update(cache, { data: { deleteTodo } }) {
            const { todos: existingTodos } = cache.readQuery({ query: GET_TODOS });
            const updatedTodos = existingTodos.filter(todo => todo.id !== deleteTodo.id);
            cache.writeQuery({
                query: GET_TODOS,
                data: { todos: updatedTodos },
            });
        },
    });

    useEffect(() => {
        if (data) {
            setTodos(data.todos);
            setEditTodos(Array(data.todos.length).fill(false));
            setEditedDescriptions(Array(data.todos.length).fill(''));
        }
    }, [data]);

    const handleEdit = (index, id, description) => {
        const updatedEditTodos = [...editTodos];
        updatedEditTodos[index] = true;
        setEditTodos(updatedEditTodos);
        const updatedEditedDescriptions = [...editedDescriptions];
        updatedEditedDescriptions[index] = description;
        setEditedDescriptions(updatedEditedDescriptions);
    }

    const handleSave = (index, id) => {
        const updatedEditTodos = [...editTodos];
        updatedEditTodos[index] = false;
        setEditTodos(updatedEditTodos);
        updateTodo({
            variables: {
                id: id,
                description: editedDescriptions[index],
            },
        });
    }    

    const handleCancelEdit = (index) => {
        const updatedEditTodos = [...editTodos];
        updatedEditTodos[index] = false;
        setEditTodos(updatedEditTodos);
    }

    const handleDelete = (id) => {
        deleteTodo({
            variables: {
                id: id,
            },
        });
    }

    return (
        <div>
            {todos.map(({ id, description }, index) => (
                <div key={id}>
                    {editTodos[index] ? (
                        <div>
                            <input
                                type="text"
                                value={editedDescriptions[index]}
                                onChange={(e) => {
                                    const updatedEditedDescriptions = [...editedDescriptions];
                                    updatedEditedDescriptions[index] = e.target.value;
                                    setEditedDescriptions(updatedEditedDescriptions);
                                }}
                            />
                            <button onClick={() => handleSave(index, id)}>Save</button>
                            <button onClick={() => handleCancelEdit(index)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p>{description}</p>
                            <button onClick={() => handleEdit(index, id, description)}>Edit</button>
                            <button onClick={() => handleDelete(id)}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Todo;
