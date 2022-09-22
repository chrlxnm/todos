const itemEdit = async (params) => {
    console.log('hehehe',params)
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({text: params.text, completed: params.completed, color: params.color })
    };
    fetch(`/todos/${params.id}`, requestOptions)
    .then(res => res.json())
    .then(
        (result) => {
            console.log(result)
        },
        (error) => {
        }
    )
}

export default itemEdit;