import React, { useState, useRef } from 'react'
import posed from 'react-pose'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    textfields: {
      marginTop: theme.spacing(1)
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
          backgroundColor: green[700],
        },
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

export default function Login() {
    const classes = useStyles()
    const input = useRef()
    const [loading, setLoading] = React.useState(false);
    const timer = React.useRef();
    const [values, setValues]=useState({
        name: '',
        password: '',
        hidde: false
    })

    const handleChange = input => event => {
        setValues({ ...values, [input]: event.target.value })
    }

    const handleClick = () => {
        if (!loading){
            setLoading(true)
            timer.current = setTimeout(() => {
                setLoading(false)
            }, 2000 )
        }
    }

    return(
        <div className='pt-5'>
            <form className='shadow text-center container w-50 bg-light rounded'>
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