import './style.css'

import { Button as ButtonAntd, Checkbox, Col, Divider as DividerAntd, Input, Radio, Row, Select as SelectAntd } from 'antd';
import { COLOR_OPTIONS, DUMMY, FILTER_STATUS_OPTIONS } from './constant';
import { useEffect, useState } from 'react';

import DeleteTodos from './services/DeleteTodos';
import GetTodoList from './services/GetList';
import SaveTodoList from './services/SaveTodoList';
import itemEdit from './services/editItem';
import styled from 'styled-components';

const { Option } = SelectAntd;
export const Todos = (props) => {
    const [userInput, setUserInput] = useState();
    const [checkedList, setCheckedList] = useState();
    const [handleBug, setHandleBug] = useState(false);
    const [todoListResult, fetchTodoList, loading] = GetTodoList();
    const [todoList, setTodoList] = useState(todoListResult);
    const [filterColorList, setColorList] = useState();
    const [queryFilter, setQueryFilter] = useState({
        status:'All',
        color:[]
    });
    useEffect(()=>{
        setTodoList(todoListResult);
        let temp = todoListResult?.filter(item=> item.completed)
        setCheckedList(temp?.map(item=> item.id))
    }, [todoListResult])

    const handleChangeCheck = (e,item) => {
        let temp = item
        temp.completed = e.target.checked
        itemEdit(temp);
        fetchTodoList();
    }
    useEffect(()=> {
        setHandleBug(false)
    }, [handleBug])

    useEffect(()=> {
        filterItemAll()
    }, [queryFilter, todoListResult])

    const filterItemAll = () => {
        console.log(queryFilter)

        let temp = todoListResult?.filter((item) => (queryFilter.status==="All" || item.completed===(queryFilter.status==="Completed"))
        && (!queryFilter?.color?.length || queryFilter?.color.includes(item.color)))
        console.log(temp);
        setTodoList(temp);
    }

    const handleSelect = (e, params) => {
        let temp = params;
        temp.color = e;
        setHandleBug(true);
        itemEdit(params);
        fetchTodoList();
    }

    const filterByStatus = (e) => {
        setQueryFilter({...queryFilter, status:e.target.value})
        // const { value } = e.target;
        // let temp
        // if (value!=="All"){
        //     let status = value==="Completed";
        //     temp = todoListResult?.filter(item => item.completed===status );
        // } else {
        //     if(filterColorList?.length){
        //     temp = todoList;
        //     }
        //     else {
        //     temp = todoListResult;
        //     }
        // }
        // setTodoList(temp);
    }

    const handleFilterByColor = (e) => {
        setQueryFilter({...queryFilter, color: e})
        // setColorList(e);
        // let temp;
        // if(e?.length>0){
        //     temp = todoListResult?.filter(item=> e?.includes(item.color?.toLowerCase()));
        // } else {
        //     temp=todoListResult;
        // }
        // setTodoList(temp);
    }

    const handleUncheckAll = () => {
        setCheckedList()
        let temp = todoList.map(item => {
            return {...item, completed: false}
        });
        setTodoList(temp);
    }
    
    const handleCheckAll = () => {
        const all = todoListResult?.map(item => item.id)
        setCheckedList(all)
        let temp = todoList.map(item => {
            return {...item, completed: true}
        });
        setTodoList(temp);
    }

    const handleSave = () => {
        SaveTodoList(userInput);
        setUserInput();
        fetchTodoList();
    }
    const handleChange = (e) => {
        setUserInput(e.target.value)
    }

    const handleDelete = (id) => {
        DeleteTodos(id);
        fetchTodoList();
    }

    
    return(
        <>
        <h1 style={{color: '#a8444e', fontWeight: 500}}>Todos</h1>
        <Card>
            <div style={{height: '65%', overflow: 'auto'}}>
                <Input 
                placeholder="What needs to be done?" 
                bordered={false} 
                onKeyPress={(e)=> e.charCode===13?handleSave() : null}
                onChange={handleChange}
                />
            <Divider />
            <Checkbox.Group 
            value={checkedList}
            // onChange={(e,j,k) =>handleChangeCheck(e,j,k)} 
            style={{width: '100%'}}
            >
            {
            loading? 
            <Text> Fetching Data.....</Text>
            :
            todoList?.map((item,idx)=>
            <Row>
                <Col span={20} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    <Checkbox onChange={(e)=>handleChangeCheck(e,item)} value={item.id} />
                    <Text>
                        {item.text}
                    </Text>
                </Col>
                <Col span={4} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    {handleBug? 
                    <Select />
                    :
                    <Select onChange={(e)=>handleSelect(e, item)} value={item.color}>
                        {COLOR_OPTIONS?.map((item) =>
                        <Option value={item}> 
                            {item} 
                        </Option>
                        )}
                    </Select>
                    }
                    <Text onClick={()=>handleDelete(item.id)} style={{cursor:'pointer', fontWeight: 700, color: 'red'}}> 
                        X 
                    </Text>
                </Col>
                <Divider />
            </Row>
            )}
            </Checkbox.Group>
            </div>

            <Row>
                <Divider />
                <Col span={6} style={{gridGap: 8}}>
                    <Text style={{textAlign: 'center', fontWeight: 600}}>Actions</Text>
                    <Button onClick={handleCheckAll} type='primary'>
                        Mark All Completed
                    </Button>
                    <Button onClick={handleUncheckAll} type='primary'>
                        Clear Completed
                    </Button>
                </Col>
                <Col span={6}>
                <Text style={{textAlign: 'center', fontWeight: 600}}>Remaining Todos</Text>
                <Text style={{textAlign: 'center'}}>{todoListResult?.map(item => item.id)?.length - checkedList?.length || 0} item left</Text>
                </Col>
                <Col span={6}>
                <Text style={{textAlign: 'center', fontWeight: 600}}>Filter By Status</Text>
                    <Radio.Group value={queryFilter.status} onChange={filterByStatus} defaultValue={undefined}>
                        {FILTER_STATUS_OPTIONS?.map(item =>
                    <FlexWrapper>
                        <Radio value={item}/>
                        <Text>{item}</Text>
                    </FlexWrapper>
                    )}
                    </Radio.Group>
                </Col>
                <Col span={6}>
                <Text style={{textAlign: 'center', fontWeight: 600}}>Filter By Color</Text>
                    <Checkbox.Group value={queryFilter.color} onChange={handleFilterByColor}>
                        {COLOR_OPTIONS?.map((item) =>
                    <FlexWrapper>
                        <Checkbox value={item}/>
                        <ColorPallete style={{backgroundColor: item}} />
                        <Text>{item}</Text>
                    </FlexWrapper>
                    )}
                    </Checkbox.Group>
                </Col>
            </Row>
        </Card>
        </>
    )
}

const Card = styled.div`
    width: 80%;
    height: 80vh;
    background-color: #fff;
    margin: auto;
    padding: 8px;
    box-shadow: 0px 2px 6px rgba(189, 196, 206, 0.43);
    border-radius: 8px;
`

const Text = styled.p`
    font-size: large;
    text-align: justify;
    margin-bottom: 0;
`

const Divider = styled(DividerAntd)`
margin: 8px 0;
`

const Select = styled(SelectAntd)`
    width: 100%;
`

const Button = styled(ButtonAntd)`
    border-radius: 8px;
    width: 160px;
    margin: 4px 0;
    background-color: #1875d4;
    font-weight: 600;
`

const FlexWrapper = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
`

const ColorPallete = styled.div`
    border-radius: 8px;
    width: 30px;
    height: 15px;
`