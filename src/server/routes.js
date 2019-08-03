//basic dependencies
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
//config dependencies
const { database } = require('../config/keys')

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

//fetching user id
const queryGetUserId = 'SELECT ID, user_registered FROM wp_users WHERE user_nicename = ?'

app.post('/userID', async (req, res) => {
    const { user_nicename } = req.body
    await pool.query(queryGetUserId, [user_nicename], (err, rows) => {
        console.log(rows[0])
    })
})

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
    const { user_nicename } = req.body

    await pool.query(queryGetUserId, [user_nicename], (err, rows) => {

        const sending = (result) => {
            const userData = {
                FirstName: result[0],
                LastName: result[1],
                ProfilePhoto: result[2],
                CreditAmount: result[3],
                Email: result[4],
                UserId: rows[0].ID,
                Since: rows[0].user_registered,
                UserName: user_nicename
            }
            res.send(userData)
        }

        const user_id = rows[0].ID
        var query_arr = [
            mysqlqueries(queryGetFirstName, user_id),
            mysqlqueries(queryGetLastName, user_id),
            mysqlqueries(queryGetProfilePhoto, user_id),
            mysqlqueries(queryGetCreditAmount, user_id),
            mysqlqueries(queryGetUserEmail, user_id),
            mysqlqueries(queryGetUserId, user_nicename)
        ]
        Promise.all(query_arr).then(sending)
    })
})

//fetching tournament info
const getTournaments = 'SELECT ID FROM wp_posts WHERE post_type = "tournament"'
const getTournamentGameName = 'SELECT meta_value FROM wp_postmeta WHERE meta_key = "tournament_game" AND post_id = ?'
const getTournamentDate = 'SELECT meta_value FROM wp_postmeta WHERE meta_key = "tournament_starts" AND post_id = ?'
const getTournamentMaxPart = 'SELECT meta_value FROM wp_postmeta WHERE meta_key = "tournament_max_participants" AND post_id = ?'
const getTournamentPlataform = 'SELECT meta_value FROM wp_postmeta WHERE meta_key = "tournament_platform" AND post_id = ?'
const getTournamentPrizes = 'SELECT meta_value FROM wp_postmeta WHERE meta_key = "tournament_prizes" AND post_id = ?'
const getTournamentCompetitors = 'SELECT meta_value FROM wp_postmeta WHERE meta_key = "tournament_competitors" AND post_id = ?'

function mysqlqueriesTournament(query, id){
    return new Promise ((resolve, reject) => {
        try{
            pool.query(query, [id], (err, rows) => {
                if (err){
                    return reject(err)
                }else{
                    return resolve(rows[0].meta_value)
                }
            })
        }catch(err){
            console.log(err)
        }
    })
}

function getTour () {
    return new Promise((resolve, reject) => {
        try{
            pool.query(getTournaments, (err, rows) => {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(rows)
                }
            })
        }catch(err){
            console.log(err)
        }
    })
}

function getTourName (id){
    return new Promise((resolve, reject) => {
        try{
            pool.query(getTournamentGameName, [id], (err, rows) => {
                if (err) {
                    return reject(err)
                }else {
                    return resolve(rows[0].meta_value)
                }
            })
        }catch(err){
            console.log(err)
        }
    })
}

async function cArr1 (rows, name){
    let arr = []
    let cont = 0
    for (let i=0; i<rows.length; i++){
        const data = {
            id: rows[i].ID,
            name: await mysqlqueriesTournament(getTournamentGameName, rows[i].ID),
            date: await mysqlqueriesTournament(getTournamentDate, rows[i].ID),
            maxPart: await mysqlqueriesTournament(getTournamentMaxPart, rows[i].ID),
            plataform: await mysqlqueriesTournament(getTournamentPlataform, rows[i].ID),
            prizes: await mysqlqueriesTournament(getTournamentPrizes, rows[i].ID),
            competitors: await mysqlqueriesTournament(getTournamentCompetitors, rows[i].ID)
            
        }
        if (data.name === name){
            arr[cont] = data
            cont ++
        }
    }
    return arr
}

app.post('/tournaments', (req, res) => {
    let { gameName } = req.body

    function send(data){
        res.send(data)
    }

    getTour().then(async(resp) => {return cArr1(resp, gameName)}).then(send)
})


//fetching tournaments info v.2 (70% more faster)
const getTourIdByName = 'SELECT post_id FROM wp_postmeta WHERE meta_value = ?'
const getTourDataById = 'SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?'

function tourID (gameName) {
    return new Promise ((resolve, reject) => {
        try{
            pool.query(getTourIdByName, [gameName], (err, rows) => {
                if (err){
                    return reject(err)
                }else{
                    return resolve(rows)
                }
            })

        }catch(err){
            console.log(err)
        }
    })
}

function getTourData(id){
    return new Promise ((resolve, reject) => {
        try{
            pool.query(getTourDataById, [id], (err, rows) => {
                if (err){
                    return reject(err)
                }else{
                    return resolve(rows)
                }
            })
        }catch(err){
            console.log(err)
        }
    })
}

async function switchTourInfo(data, info){
    for (let i=0; i<info.length; i++){
        switch(info[i].meta_key){
            case "tournament_game": {
                data.game = info[i].meta_value
                break
            }
            case "tournament_starts": {
                data.date = info[i].meta_value
                break
            }
            case "tournament_max_participants": {
                data.maxPart = info[i].meta_value
                break
            }
            case "tournament_platform": {
                data.plataform = info[i].meta_value
                break
            }
            case "tournament_prizes": {
                data.prizes = info[i].meta_value
                break
            }
            case "tournament_competitors": {
                data.competitors = info[i].meta_value
                break
            }
            default: {
                
                break
            }
        }
    }
    return data
}

async function cArr (rows){
    let arr = []
    for (let i=0; i<rows.length; i++){
        const data = {
            id: rows[i].post_id
        }
        const a = await getTourData(rows[i].post_id).then(async(resp) => {
            return switchTourInfo(data, resp)
        })
        arr[i] = a
    }
    return arr
}

app.post('/tournaments2', async (req, res) => {
    let { gameName } = req.body

    function send (rows){
        res.send(rows)
    }

    tourID(gameName).then(cArr).then(send)
})

