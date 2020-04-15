function template(todo) {
  return `
  <li class="todo-item ${todo.done ? 'done' : ''}" id="todo-item" key="${todo.id}">
    <h1 class="todo-item-title">${todo.title}</h1>
    <p class="todo-item-description">${todo.description}</p>
    ${todo.done ? '<button class="todo-item-removebtn btn" id="todo-item-removebtn" type="button">Remove</button>' : ''}
  </li>
  `;
}

const nextId = (todos) => {
  const highestId = todos.reduce((a, c) => (c.id > a ? c.id : a), 0);
  return Number.parseInt(highestId, 10) + 1;
};

function update() {
  window.dispatchEvent(new Event('statechange'));
}

function getTodos() {
  return JSON.parse(window.localStorage.getItem('todos')) || [];
}

function setTodos() {
  if (!window.localStorage.getItem('todos')) {
    window.localStorage.setItem('todos', JSON.stringify([]));
  }
}

function addNewTodo() {
  setTodos();

  if (document.getElementById('title').value.length !== 0) {
    const todos = getTodos();

    const inputTitle = document.getElementById('title').value;
    const inputDescription = document.getElementById('description').value;
    const id = nextId(todos);

    const newTodo = {
      id,
      title: inputTitle,
      description: inputDescription,
      done: false,
    };

    window.localStorage.setItem('todos', JSON.stringify([...todos, newTodo]));

    document.getElementById('new-todo-item-form').reset();

    update();
  }
}

function markTodoDone(targetId) {
  const todos = getTodos();
  const targetIndex = todos.findIndex((todo) => todo.id === targetId);

  todos[targetIndex].done = !todos[targetIndex].done;
  window.localStorage.setItem('todos', JSON.stringify(todos));

  update();
}

function removeTodo(id) {
  const todos = getTodos().filter((todo) => todo.id !== id);
  window.localStorage.setItem('todos', JSON.stringify(todos));
  update();
}

function render() {
  const todos = getTodos();
  document.getElementById('todos').innerHTML = todos.map((todo) => (template(todo))).join('');
}

window.addEventListener('statechange', () => {
  render();
});

document.getElementById('todos').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const targetId = Number.parseInt(e.target.attributes.key.value, 10);
    markTodoDone(targetId);
  } else if (e.target.tagName !== 'BUTTON') {
    const targetId = Number.parseInt(e.target.parentNode.attributes.key.value, 10);
    markTodoDone(targetId);
  } else {
    const id = Number.parseInt(e.target.parentNode.attributes.key.value, 10);
    removeTodo(id);
  }
});

document.getElementById('new-todo-item-form').addEventListener('submit', (e) => {
  e.preventDefault();
  addNewTodo();
});


window.onload = () => {
  setTodos();
  render();
};
