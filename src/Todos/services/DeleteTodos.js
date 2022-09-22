const DeleteTodos = async (params) => {
    try{
    fetch(`/todos/${params}`, { method: 'DELETE' })
        .then(() => console.log('sukses delete'));
    }
    catch(e) {}
}

export default DeleteTodos;