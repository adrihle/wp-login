//basic dependencies
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
//config dependencies
const { database } = require('../config/keys')
const crypto = require('crypto')
const hasher = require('wordpress-hash-node')

//setup backend server
const app = express()

app.set('port', process.env.PORT || 4000)

app.listen(app.get('port'), () => {
    console.log('server running on port: '+app.get('port'))
})

//setup middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

//setup mysql connection
const pool = mysql.createPool(database)

// deploying
// //auth user
// const queryAuthUser = 'SELECT user_pass FROM wp_users WHERE user_login = ?'

// app.post('/auth', async (req, res) => {
//     const { username, password } = req.body
//     const user = {
//         username,
//         password: crypto.createHash('md5').update(password).digest('hex')
//     }
//     await pool.query(queryAuthUser, [username], (err, rows) => {
//         console.log(rows[0].user_pass, user.password)
//     })
// })

//fetching user info
const queryGetProfilePhoto = 'SELECT meta_value FROM wp_usermeta WHERE user_id = ? AND meta_key = "profile_photo"'
const queryGetFirstName = 'SELECT meta_value FROM wp_usermeta WHERE user_id = ? AND meta_key = "first_name"'
const queryGetLastName = 'SELECT meta_value FROM wp_usermeta WHERE user_id = ? AND meta_key = "last_name"'
const queryGetCreditAmount = 'SELECT meta_value FROM wp_usermeta WHERE user_id = ? AND meta_key = "_uw_balance"'
const queryGetUserEmail = 'SELECT meta_value FROM wp_usermeta WHERE user_id = ? AND meta_key = "billing_email"'

function mysqlqueries(query, user_id){
    return new Promise((resolve, reject) => {
        try {
            pool.query(query, [user_id], (err, rows) => {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(rows[0].meta_value)
                }
            })

        } catch(err) {
            console.log('error fetching data')
        }
    })
}

app.post('/user/profileData', async (req, res) => {

    const { user_id } = req.body
    var query_arr = [
        mysqlqueries(queryGetFirstName, user_id),
        mysqlqueries(queryGetLastName, user_id),
        mysqlqueries(queryGetProfilePhoto, user_id),
        mysqlqueries(queryGetCreditAmount, user_id),
        mysqlqueries(queryGetUserEmail, user_id)
    ]

    const sending = (result) => {
        const userData = {
            FirstName: result[0],
            LastName: result[1],
            ProfilePhoto: result[2],
            CreditAmount: result[3],
            Email: result[4]
        }
        res.send(userData)
    }

    Promise.all(query_arr).then(sending)
})
