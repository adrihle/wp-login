//basic dependencies
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
//config dependencies
const { database } = require('../config/keys')
var unserialize = require('php-unserialize');
var serialize = require('js-php-serialize')

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

//fetching tournaments info v.2 (70% more faster)
const getTourIdByName = 'SELECT post_id FROM wp_postmeta WHERE meta_value = ?'
const getTourDataById = 'SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?'
const getTourCompetitors = 'SELECT meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = "tournament_competitors"'
const getTourCompCache = 'SELECT meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = "participant_cache"'
const updateTourParticipants = 'UPDATE wp_postmeta SET meta_value = ? WHERE meta_key = "tournament_competitors" AND post_id = ?'
const updateTourPartCache = 'UPDATE wp_postmeta SET meta_value = ? WHERE meta_key = "participant_cache" AND post_id = ?'

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
                data.prizes = unserialize.unserialize(info[i].meta_value)
                break
            }
            case "tournament_competitors": {
                let unserializedParticipants = await unseralizedCompetitors(unserialize.unserialize(info[i].meta_value))
                data.competitors = unserializedParticipants
                break
            }
            default: {break}
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

//serialized method for the own tournament property (competitors) for upload to db
async function serializedCompetitors(competitors){
    let participants = {}
    for (let i=0; i<competitors.length; i++){
        const prop = `${competitors[i].user}`
        participants[`${competitors[i].user}`] = prop
    }
    return participants
}

//deserialized function for transform db tournament competitors php data to own js tournament property (competitors)
async function unseralizedCompetitors(competitors){
    let participants = []
        
    for (var key in competitors){
        let user = {}
        if (competitors.hasOwnProperty(key)){
            user.user = competitors[key]
            participants.push(user)
        }
    }
    return participants
}

app.post('/tournaments', async (req, res) => {
    let { gameName } = req.body

    function send (rows){
        res.send(rows)
    }

    tourID(gameName).then(cArr).then(send)
})

function pushCompetitors(competitors, id, query){
    return new Promise ((resolve, reject) => {
        try{
            pool.query(query, [competitors, id], (err)=>{
                if (err){
                    return reject(err)
                }else{
                    return resolve('competitors updated correctly')
                }
            })
        }catch(err){
            console.log(err)
        }
    })
}

async function updateCompetitors(competitor, id) {
    let competitors = await mysqlqueries(getTourCompetitors, id)
    let unseCompetitors = await unseralizedCompetitors(unserialize.unserialize(competitors))
    const ob = {
        user: competitor
    }
    unseCompetitors.push(ob)
    let seCompetitors = await serialize.serialize(await serializedCompetitors(unseCompetitors))

    return seCompetitors
}

async function serializedCacheCompetitors(cache, participantId, participantName){
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    const newParticipant = {
        id: participantId,
        seed: Object.size(cache) + 1,
        name: participantName,
        url: `http://a2wgames.com/members/${participantName}/`
    }

    cache[`${participantId}`] = newParticipant

    return serialize.serialize(cache)
}

app.post('/tournaments/addCompetitor', async (req, res) => {
    const { tournamentID, competitorsID, competitorName } = req.body
    function send (a){
        res.send(a)
    }
    updateCompetitors(competitorsID, tournamentID).then(async(resp) => {
        return pushCompetitors(resp, tournamentID, updateTourParticipants)
    })
    mysqlqueries(getTourCompCache, tournamentID).then(async(resp) => {
        let cache = unserialize.unserialize(resp)
        return cache
    }).then(async(cache) => {
        return serializedCacheCompetitors(cache, competitorsID, competitorName)
    }).then((a) => {
        return pushCompetitors(a, tournamentID, updateTourPartCache)
    }).then(send)

})




