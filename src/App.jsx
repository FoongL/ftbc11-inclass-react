import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Counter from "./components/counter.jsx";
import { FancyBorder } from "./components/fancyBorders";

import { database, storage } from "./firebase";

import {
  ref,
  set,
  push,
  onChildAdded,
  remove,
  onChildRemoved,
  onValue,
} from "firebase/database";

import {ref as storeRef, uploadBytesResumable, getDownloadURL} from 'firebase/storage'

const DB_TASKLIST_KEY = "tasks";
const STORE_IMAGE_KEY='images'

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
      taskList: [],
      file:null,
    };
  }

  componentDidMount = () => {
    const taskListRef = ref(database, DB_TASKLIST_KEY);
    onChildAdded(taskListRef, (task) => {
      console.log("Task added:", task.val().name);
      this.setState((state) => ({
        taskList: [...state.taskList, { key: task.key, name: task.val().name }],
      }));
    });
    onChildRemoved(taskListRef, (task) => {
      console.log("Task Removed:", task.val().name);
      const remainingTasks = this.state.taskList.filter((tasks) => {
        return tasks.key !== task.key;
      });
      console.log("remaining Tasks:", remainingTasks);
      this.setState({
        taskList: remainingTasks
      })
    });
    // onValue(taskListRef, (snapShot)=>{
    //   // const data = snapShot.val()
    //   // console.log('data:', data)
    //   console.log('snapShot:', snapShot.val())

    // })
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

  handleTaskChange = (e) => {
    this.setState({
      task: e.target.value,
    });
  };

  handleTaskSubmit = () => {
    // Upload my file to the storage
    const taskListref = ref(database, DB_TASKLIST_KEY)
    const fileRef = storeRef(storage, `${STORE_IMAGE_KEY}/${this.state.file.name}`)
    uploadBytesResumable(fileRef, this.state.file).then(()=>{
      getDownloadURL(fileRef).then((url)=>{
        const task = {
          name: this.state.task,
          imgURL: url
        }
        push(taskListref, task).then(()=>{
          this.setState({
            task: "",
            file: null
          });
        })
      })
    })

    // adding new Task to the realtime Database
    ;


  };

  handleFileChange=(e)=>{
    this.setState({
      file: e.target.files[0]
    })
  }

  handleDelete = (e) => {
    const { id } = e.target;
    console.log(id);
    const taskRef = ref(database, `${DB_TASKLIST_KEY}/${id}`);
    remove(taskRef);
  };

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
          <input id='imgInput' type='file' onChange={this.handleFileChange}></input>
          <button onClick={this.handleTaskSubmit}>Submit Task</button>
          {this.state.taskList.map((task) => (
            <div>
              <p key={task.key}>{task.name}</p>
              <button id={task.key} onClick={this.handleDelete}>
                Delete
              </button>
            </div>
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
