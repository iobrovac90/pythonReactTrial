import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';


const BASE_URL = 'http://127.0.0.1:8000'; // FastAPI's base URL




function App() {

 const getTodos = async () => {
  const response = await axios.get(`${BASE_URL}/todos`);
  setAllTodos(response.data);
};

//  const createTodo = async (todo) => {
//   const response = await axios.post(`${BASE_URL}/todos`, todo);
//   console.log("CREATE TODO RESPONSE ::: ",response.data);
//   getTodos();
// };

const createTodo = async (newTodo) => {
  axios
  .post(`${BASE_URL}/todos/`, {
    task: newTodo.task,
    completed: false,
  })
  .then((response) => {
    console.log("Success:", response.data);
    getTodos();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
};

 const updateTodo = async (id, updatedData) => {
  axios
  .put(`${BASE_URL}/todos/${id}`, updatedData)
  .then((response) => {
    console.log("Success:", response.data);
    getTodos();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
};

 const deleteTodo = async (id) => {
  axios
  .delete(`${BASE_URL}/todos/${id}`)
  .then((response) => {
    console.log("Success:", response.data);
    getTodos();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
};


  const [currentText, setcurrentText] = useState({
    task: "",
    completed: false,
  });
  const [allTodos, setAllTodos] = useState([]);
  const [isEditMode, setIsEditMode] = useState({
    id:0, 
    is: false,
  });

  useEffect(() => {
    getTodos();
  }, [])

  return (
    <div className="App">
      <div style={{margin: "0 auto", border: "1px solid black", width: "500px", marginTop: "200px", display: "flex", justifyContent: "space-between"}}>
          <input type="text" value={currentText.task} onChange={(e) => {setcurrentText({
            task: e.target.value, 
            completed: false,
            })}} style={{width: "300px"}}/>
          <button type="submit" onClick={() => {
            createTodo(currentText)
            // getTodos();
          }}
            >ADD TASK</button>
      </div>
      <div style={{margin: "0 auto", border: "1px solid black", width: "500px", marginTop: "100px"}}>
          {allTodos.map(item => <div key={item.id} style={{border: `${isEditMode.id === item.id && isEditMode.is ? "1px solid red" : ""}`, display: "flex", justifyContent: "space-between", alignItems: "center"}}><p style={{width: "150px"}}>
            <textarea style={{height: "fit-content"}} type="text" onChange={(e) => {
              const index = allTodos.findIndex(todo => todo.id === item.id);
              const updatedTodos = [...allTodos];
              updatedTodos[index].task = e.target.value;
              setAllTodos(updatedTodos);
            }} value={item.task} disabled={!(isEditMode.id === item.id && isEditMode.is)}/></p>
          <button onClick={() => {
            if(isEditMode.id === item.id && isEditMode.is) {
              const newItem  = allTodos.find(newItem => newItem.id === item.id)
              updateTodo(newItem.id, newItem);
              setIsEditMode({
                id: item.id, 
                is: !isEditMode.is,
              })
              return;
            }
            setIsEditMode({
              id: item.id, 
              is: !isEditMode.is,
            })
          }}
          style={{height: "30px"}}
          >{isEditMode.id === item.id && isEditMode.is ? "SAVE" : "EDIT MODE"}</button>
          <button
          onClick={() => deleteTodo(item.id)}
          >DELETE</button>
          <input type="checkbox" checked={item.completed} onChange={() => {
            updateTodo(item.id, {
              ...item, 
              completed: !item.completed,
            })
          }}/></div>
          )}
      </div>
    </div>
  );
}

export default App;
