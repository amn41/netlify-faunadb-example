/* Api methods to call /functions */

const create = (data) => {
  return fetch('/.netlify/functions/todos-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAll = () => {
  return fetch('/.netlify/functions/activities-read-all').then((response) => {
    return response.json()
  })
}

const readLeaderboard = () => {
  return fetch('/.netlify/functions/leaderboard-read').then((response) => {
    return response.json()
  })
}    

const readWeeklyLeaderboard = () => {
  return fetch('/.netlify/functions/weekly-leaderboard-read').then((response) => {
    return response.json()
  })
}    

const update = (todoId, data) => {
  return fetch(`/.netlify/functions/todos-update/${todoId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteTodo = (todoId) => {
  return fetch(`/.netlify/functions/todos-delete/${todoId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

const batchDeleteTodo = (todoIds) => {
  return fetch(`/.netlify/functions/todos-delete-batch`, {
    body: JSON.stringify({
      ids: todoIds
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export default {
  create: create,
  readAll: readAll,
  readLeaderboard: readLeaderboard,
  readWeeklyLeaderboard: readWeeklyLeaderboard,
  update: update,
  delete: deleteTodo,
  batchDelete: batchDeleteTodo
}
