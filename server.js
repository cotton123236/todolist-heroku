const http = require('http')
const { v4: uuidv4 } = require('uuid')
const useError = require('./error')

const data = []

const requestLinstener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  }

  let body = ''

  req.on('data', chunk => { body += chunk })

  // GET
  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      status: 'success',
      data
    }))
    res.end()
  }
  // POST
  else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const todo = JSON.parse(body)
        if (todo.title !== undefined) {
          data.push(Object.assign(todo, {
            id: uuidv4()
          }))
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            status: 'success',
            data
          }))
        }
        else {
          useError(res, headers)
        }
      }
      catch(error) {
        useError(res, headers)
      }
      res.end()
    })
  }
  // DELETE ALL
  else if (req.url === '/todos' && req.method === 'DELETE') {
    data.length = 0
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      status: 'success',
      data
    }))
    res.end()
  }
  // DELETE ONE
  else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop()
    const index = data.findIndex(item => item.id === id)
    if (index > -1) {
      data.splice(index, 1)
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        status: 'success',
        data
      }))
    }
    else {
      useError(res, headers)
    }
    res.end()
  }
  // PATCH
  else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const todo = JSON.parse(body)
        const id = req.url.split('/').pop()
        const index = data.findIndex(item => item.id === id)
        if (todo.title !== undefined && index > -1) {
          Object.assign(data[index], {
            title: todo.title
          })
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            status: 'success',
            data
          }))
        }
        else {
          useError(res, headers)
        }
      }
      catch(error) {
        useError(res, headers)
      }
      res.end()
    })
  }
  // OPTIONS
  else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers)
    res.end()
  }
  // 404
  else {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.write('404 not found')
    res.end()
  }
}

const server = http.createServer(requestLinstener)

server.listen(process.env.PORT || 8080)