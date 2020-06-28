const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

jest.mock('@sendgrid/mail');

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "Joaquín Ayala",
        email: "joaquin.ayala.c@gmail.com",
        password: "MyPass777"
    }).expect(201)

    // Test ideas
    // Assert that database was changed correctly

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response 
    expect(response.body).toMatchObject({
        user: {
            name: 'Joaquín Ayala',
            email: "joaquin.ayala.c@gmail.com"
        },
        token: user.tokens[0].token
    })

    // expect something about user password

    expect(user.password).not.toBe('MyPass777')
})


test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)

    //Assert that the token is set when the user logs in
    await expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non existent user',async () => {
    await request(app).post('/users/login').send({
        email: 'asdf@asdf.asd',
        password: 'passwordsd'
    }).expect(400)
})

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Shouldnt get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar' , 'tests/fixtures/profile-pic.jpg')
        .expect(200) 

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "John",
            email: "john@example.com"
        })
        
    const user = await User.findById(userOneId)
    expect(user.name).toBe("John")
    expect(user.email).toBe('john@example.com')
})

test('Should not update invalid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Fake location",
            country: "Fake country"
        })
        .expect(400)
})