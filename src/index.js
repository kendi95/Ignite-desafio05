const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  if (!username) {
    return response
      .status(400)
      .json({ error: 'Username must been passed.' });
  }

  const user = users.find(findedUser => findedUser.username === username);

  if (!user) {
    return response
      .status(400)
      .json({ error: `Don't have user with that username: ${username}` });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const findUser = users.find(findedUser => findedUser.username === username);

  if (findUser) {
    return response.status(400).json({ error: 'Username already exists.' });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;
  return response.status(200).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { todos } = request.user;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { todos } = request.user;

  const findedIndex = todos.findIndex(findedTodo => findedTodo.id === id);

  if (findedIndex === -1) {
    return response
      .status(404)
      .json({ error: "Don't have todo with this id." });
  }

  Object.assign(todos[findedIndex], {
    title,
    deadline
  });

  return response.status(200).json(todos[findedIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { todos } = request.user;

  const findedIndex = todos
    .findIndex(findedTodo => findedTodo.id === id);

  if (findedIndex === -1) {
    return response
      .status(404)
      .json({ error: "Don't have todo with this id." });
  }

  Object.assign(todos[findedIndex], {
    done: true
  });

  return response.status(200).json(todos[findedIndex]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { todos } = request.user;

  const todo = todos.find(findedTodo => findedTodo.id === id);

  if (!todo) {
    return response
      .status(404)
      .json({ error: "Don't have todo with this id." });
  }

  todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;