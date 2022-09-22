const SaveTodoList = async (params) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: params, completed: false, color: undefined })
        };
        fetch("/todos", requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
            },
            (error) => {
            }
        )
    }

export default SaveTodoList;