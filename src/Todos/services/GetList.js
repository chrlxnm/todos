import { useEffect, useState } from "react";

const GetTodoList = () => {
    const [todoListResult, setTodoList] = useState();
    const [loading, setLoading] = useState(false);
    const fetchTodoList = () => {
        setLoading(true)
        fetch("/todos")
        .then(res => res.json())
        .then(
            (result) => {
            setLoading(false);
            setTodoList(result);
            },
            (error) => {
                setLoading(false);
            }
        )
    }
    useEffect(()=>{
        fetchTodoList();
    },[])

    
    return [todoListResult, fetchTodoList, loading];
}

export default GetTodoList;