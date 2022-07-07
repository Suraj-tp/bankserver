//server creation

//1.import express using the keyword require-itz a function,and the argument expected is the library name
const express = require('express')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

//import register function in data.service.js
const dataService = require('./services/data.service')

//using this express we create server application
const app = express()   //server name is given as app

//parse JSON data
app.use(express.json())

//application specific middleware
const appMiddlewareName = (req, res, next) => {
    console.log("Application specific middleware");
    next()
}

//Entire application specific--use middleware in app(enitire server) 
app.use(appMiddlewareName)

//Router specific middleware(for certain APIs)
const jwtMiddleWare = (req, res, next) => {
    //fetch token
    try {
        token = req.headers['x-access-token']
        //verify token
        const data = jwt.verify(token, 'supersecretkey7090057755')
        console.log(data);
        next()
    }
    catch {
        res.status(401).json({
            status: false,
            statusCode: 401,
            message: "please log in"
        })
    }
}

//bank server creation 


//register API
app.post('/register', (req, res) => {
    //register resolving
    const result = dataService.register(req.body.username, req.body.acno, req.body.password)
    res.status(result.statusCode).json(result)
})

//login API
app.post('/login', (req, res) => {
    //login resolving
    const result = dataService.login(req.body.acno, req.body.pswd)
    res.status(result.statusCode).json(result)
})

//deposit API
app.post('/deposit', jwtMiddleWare, (req, res) => {
    //deposit resolving
    const result = dataService.deposit(req.body.accno, req.body.pswd, req.body.amt)
    res.status(result.statusCode).json(result)
})


//withdraw API
app.post('/withdraw',jwtMiddleWare, (req, res) => {
    //withdraw resolving
    const result = dataService.withdraw(req.body.accno, req.body.pswd, req.body.amt)
    res.status(result.statusCode).json(result)
})

//getTransaction API
app.get('/getTransaction', (req, res) => {
    //getTransaction resolving
    const result = dataService.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)
})



//user request resolving
//GET Request-in browser output will see only for get request,rest requests output will not show in browser

//GET request-- client will give GET request to fetch or read the data from server 
app.get('/', (req, res) => {
    res.send("GET request")
})

//POST Request--client will give POST request to create data in server
app.post('/', (req, res) => {
    res.send("POST request")
})

//PUT Request--client will give PUT request to modify entire data in server
app.put('/', (req, res) => {
    res.send("PUT request")
})

//PATCH Request--client will give PATCH request to modify the data partially in server
app.patch('/', (req, res) => {
    res.send("PATCH request")
})

//DELETE request--client will give DELETE request to remove or delete the data in the server
app.delete('/', (req, res) => {
    res.send("DELETE request")
})

//set up the port number to the server app
app.listen(3000, () => {
    console.log("server started at 3000");
})