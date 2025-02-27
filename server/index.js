// Dependencies
const express = require ('express')
const app = express()
const mysql = require ('mysql')
const cors = require ('cors')

app.use(express.json())
app.use(cors())

//run the server 
app.listen(3002, ()=> {
    console.log('server is running on port 3002')
}) 

//create the db
const db = mysql.createConnection({
    user: 'root', 
    host: 'localhost',
    password: '',
    database: 'elearn'
})

//Registration
app.post('/register', (req, res) =>{
    //get variables sent from the form 
    const sentUsername = req.body.Username
    const sentName = req.body.Name
    const sentEmail = req.body.Email
    const sentPassword = req.body.Password
    const sentRole = req.body.Role
    
    //Sql statement to insert in the DB 

    const SQL = 'INSERT INTO user (username, name, email, password, role) VALUES (?,?,?,?,?)'
    const Values = [sentUsername, sentName, sentEmail, sentPassword, sentRole]
    
    //query to execute the sql statement
    db.query(SQL, Values, (err, results)=>{
        if (err){
            res.send(err)
        }
        else{
            console.log('User inserted successfully! ')
            res.send({message: 'User added!'})
        }
    })

})

//Login 
app.post('/login', (req, res)=>{
    //get variables sent from the form 
    const sentloginEmail = req.body.LoginEmail
    const sentloginPassword = req.body.LoginPassword
    
    //Sql statement to insert in the DB 

    const SQL = 'SELECT * FROM user WHERE email = ? && password = ?'
    const Values = [sentloginEmail, sentloginPassword]

     //query to execute the sql statement
     db.query(SQL, Values, (err, results)=>{
        if(err){
            res.send({error: err})
        }if (results.length > 0){
            res.send(results)
        }else{
            res.send({message:`Credentials don't match !`})
        }
    })
})

