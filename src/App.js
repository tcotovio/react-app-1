import React, { Component } from 'react';
import PropTypes from 'prop-types'
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo';
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from './lib/todoHelpers'
import {pipe, partial} from './lib/utils'
import {loadTodos, createTodo, saveTodo, destroyTodo} from './lib/todoService'

class App extends Component{
  state = {
    todos: [],
    currentTodo: ''
  }

  //in order to access route from content??
  static contextTypes = {
    route: PropTypes.string
  }

  componentDidMount() {
    loadTodos().then(todos => this.setState({todos}) )
  }

  handleRemove = (id, evt) => {
    evt.preventDefault()
    const updatedTodos = removeTodo(this.state.todos, id)
    this.setState({todos: updatedTodos})
    destroyTodo(id).then(() => this.showTempMessage('Todo removed'))
  }

  handleToggle = (id) => {
    const getToggledTodo = pipe(findById, toggleTodo)
    const updated = getToggledTodo(id, this.state.todos)
    const getUpdatedTodos = partial(updateTodo, this.state.todos)
    const updatedTodos = getUpdatedTodos(updated)
    this.setState({todos: updatedTodos})
    saveTodo(updated).then(() => this.showTempMessage('Todo updated'))
  }

  handleSubmit = (evt) => { 
    evt.preventDefault()
    const newId = generateId()
    const newTodo = {id: newId, name: this.state.currentTodo, isComplete: false}
    const updatedTodos = addTodo(this.state.todos, newTodo)
    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMsg: ''
    })
    createTodo(newTodo).then(() => this.showTempMessage('Todo added'))
  }

  showTempMessage = (msg) => {
    this.setState({message: msg})
    setTimeout(() => this.setState({message: ''}), 2500)
  }
 
  handleEmptySubmit = (evt) => {
    evt.preventDefault()
    this.setState({
      errorMsg: 'Please  supply a todo name'
    })
  }

  handleInputChange = (evt) => {
    this.setState({currentTodo: evt.target.value})
  }

  render(){
    const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
      </div>
      <div className = 'Todo-App'>
        {this.state.errorMsg && <span className = 'error'>{this.state.errorMsg}</span>}
        {this.state.message && <span className = 'success'>{this.state.message}</span>}
        <TodoForm handleInputChange = {this.handleInputChange} 
                currentTodo = {this.state.currentTodo} handleSubmit = {submitHandler}/> 
        <TodoList handleToggle = {this.handleToggle} handleRemove = {this.handleRemove}
            todos = {displayTodos}/> 
        <Footer/>
      </div>
    </div>
  );
}
}

export default App;
