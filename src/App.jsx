import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Counter from "./components/counter.jsx";
import { FancyBorder } from "./components/fancyBorders";

import { database } from './firebase'

import {ref, set, push, onChildAdded} from 'firebase/database'

const DB_TASKLIST_KEY = 'tasks'

const sayHello = (user) =>
  user ? <h4>Hello {user}!</h4> : <h4>Hello Stranger!</h4>;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 0,
      nameInput: "",
      randomInput: "",
      nameArray: [],
      task: "",
      taskList:[]
    };
  }

  componentDidMount = () => {

    console.log('env:', process.env.REACT_APP_TEST_VAR)
    // const storedNames = localStorage.getItem("name");
    // if (storedNames) {
    //   this.setState({
    //     nameArray: JSON.parse(storedNames),
    //   });
    // }
    const taskListRef = ref(database, DB_TASKLIST_KEY)
    onChildAdded(taskListRef, (task)=>{
      console.log('Task added:', task.val().name)
      this.setState((state)=>({
        taskList:[...state.taskList, {key: task.key, name: task.val().name}]
      }))
    })

  };

  increment = () => {
    this.setState({
      clicked: this.state.clicked + 1,
    });
  };

  decrement = () => {
    this.setState({
      clicked: this.state.clicked - 1,
    });
  };

  // callBackFunction = () => {
  //   console.log("inside callback:", this.state.clicked);
  // };

  // componentDidUpdate() {
  //   console.log("inside component did update:", this.state.clicked);
  // }

  handleChange = (event) => {
    const { value, name } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      nameArray: [...this.state.nameArray, this.state.nameInput],
      nameInput: "",
    });
    const storedName = JSON.parse(localStorage.getItem("name"));
    if (!storedName) {
      localStorage.setItem("name", JSON.stringify([this.state.nameInput]));
    } else {
      localStorage.setItem(
        "name",
        JSON.stringify([...storedName, this.state.nameInput])
      );
    }
  };

  deleteStuff = () => {
    localStorage.removeItem("name");
    this.setState({
      nameArray: [],
    });
  };

  handleTaskChange =(e)=>{
    this.setState({
      task: e.target.value
    })
  }

  handleTaskSubmit =()=>{
    // do stuff here
    const taskListref = ref(database, DB_TASKLIST_KEY)
    const newTaskref = push(taskListref)
    // console.log('newTaskref:', newTaskref)
    const task ={
      name: this.state.task,
      date: new Date()
    }
    set(newTaskref, task);

    this.setState({
      task:''
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <FancyBorder>
            {sayHello()}
            <button onClick={this.increment}>Increment</button>
            <h2>{this.state.clicked}</h2>
            {this.state.clicked > 5 ? (
              <h1>SURPRISE!</h1>
            ) : (
              <p>You have not clicked enough yet</p>
            )}
          </FancyBorder>
          <input
            id="taskInput"
            placeholder="give me a new task"
            value={this.state.task}
            onChange={this.handleTaskChange}
          ></input>
          <button onClick={this.handleTaskSubmit}>Submit Task</button>
          {this.state.taskList.map((task)=>(
            <p key={task.key}>{task.name}</p>
          ))}
        </header>
      </div>
    );
  }
}
export default App;

/* {this.state.nameArray.length > 0 ? (
            this.state.nameArray.map((person, index) => (
              <FancyBorder>
                <Counter
                  name={person}
                  key={index}
                  className="counterList"
                  globalClickState={this.state.clicked}
                  globalIncrement={this.increment}
                  globalDecrement={this.decrement}
                />
              </FancyBorder>
            ))
          ) : (
            <div></div>
          )}
          <form onSubmit={this.handleSubmit}>
            <label>Name: </label>
            <input
              name="nameInput"
              type="text"
              onChange={this.handleChange}
              value={this.state.nameInput}
              placeholder="Input a name here"
            ></input>
            <br />
            {/* <label>Random Input: </label>
            <input name='randomInput' type='text' onChange={this.handleChange} value={this.state.randomInput}></input> */
// <button type="submit">Submit Name</button>
// </form>
// <button onClick={this.deleteStuff}>delete local storage</button>
