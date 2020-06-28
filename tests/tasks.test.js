const app = require('../src/app')
const request = require('supertest')
const Task = require('../src/models/task')
const {
    userOneId, 
    userOne, 
    setupDatabase,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            "description" : 'Test my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
    expect(task.description).toBe('Test my test')
})

test('Should get all tasks from user', async() =>{
    const response = await request(app)
        .get('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const tasks = response.body
    expect(tasks.length).toBe(2)
})

test('Should not delete task from another user', async() =>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})