import React, { useState, useRef } from 'react'
import posed from 'react-pose'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import url from '../config/siteUrl'
import AlertWrongLogin from '../components/AlertWrongLogin'
var emitter = require('../config/global_emitter')

const useStyles = makeStyles(theme => ({
    textfields: {
      marginTop: theme.spacing(1)
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: 'blue',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}))

const Container = posed.div({
    enter: { staggerChildren: 50 }
})

const Fields = posed.div({
    enter: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 }
})

export default function Login(props) {
    const classes = useStyles()
    const input = useRef()
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState(false)
    const [values, setValues]=useState({
        name: '',
        password: ''
    })

    const handleChange = input => event => {
        setValues({ ...values, [input]: event.target.value })
    }

    
    const handleClick = async () => {
        const { name, password } = values
        const loginData = {
            username: name,
            password,
        }
        setLoading(true)
        await axios.post(`${url.siteUrl}/wp-json/jwt-auth/v1/token`, loginData)
            .then( res => {
                if ( undefined === res.data.token ){
                    setValues({ ...values, err: res.data.message })
                    setLoading(false)
                    console.log('algo fue mal')
                    return
                }

                localStorage.setItem('userName', res.data.user_display_name)
                setLoading(false)
                props.history.push('/')
                emitter.emit('isLogin')
            })
            .catch( err => {
                setAlert(true)
            })
    }

    const handleAlert = () => {
        setValues({...values,
                        name: '',
                        password: ''
                    })
        setAlert(false)
        setLoading(false)
    }

    return(
        <div className='pt-5'>
            <AlertWrongLogin open={alert} onClick={handleAlert}/>
            <form className='shadow text-center container w-75 bg-light rounded' >
            <Container>
                <Fields><h5 className='pt-5 pb-2'>Sign In</h5></Fields>
                <Fields>
                    <TextField
                    id="standard-name"
                    label="Name"
                    name='username'
                    ref={input}
                    value={values.name}
                    onChange={handleChange('name')}
                    type='text'
                    // value={this.state.username}
                    // onChange={this.handleOnChange}
                    margin="normal"/>
                </Fields>
                <Fields>
                    <TextField
                    label="Password"
                    type="password"
                    name='password'
                    value={values.password}
                    onChange={handleChange('password')}
                    className={classes.textfields}
                    // value={this.state.password}
                    // onChange={this.handleOnChange}
                    />
                </Fields>
                <Fields>
                    <div className={classes.wrapper}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            className='mt-5 mb-5'
                            disabled={loading}
                            onClick={handleClick}>
                                Submit
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                    </div>
                </Fields>
            </Container>
        </form>
        </div>
    )
}