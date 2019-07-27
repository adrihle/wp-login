import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles'
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom'
var emitter = require('../config/global_emitter')

const useStyles = makeStyles({
  avatar: {
    width: 60,
    height: 60,
    boxShadow: '10px 10px rgba(0,0,0,0.7)',
    MozBoxShadow: '10px 10px rgba(0,0,0,0.7)',
    WebkitBoxShadow: '10px 10px rgba(0,0,0,0.7)',
  },
  box: {
    marginRight: -10
  },
  popupMenu: {
    marginTop: 40
  }
})


export default function MenuAppBar(props) {
  const classes = useStyles()
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem('urlAvatar')
    if ( token === null ){
      setAuth(false)
    }else{
      setAuth(true)
    }
  },[])

  emitter.addListener('isLogin', () => {
    setAuth(true)
  })

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleLogOut () {
    handleClose()
    setAuth(false)
    localStorage.clear();
    props.history.push('/login')
  }

  return (
      <AppBar position="static">
        <Toolbar className='d-flex justify-content-between'>
            <Link to='/'>
                <h5 
                className='text-white'>
                    Dashboard
                </h5>
            </Link>
          {auth ? (
            <div>
              {/* islogin button */}
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                className={classes.box}
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt="Avatar" src={localStorage.getItem('urlAvatar')} className={classes.bigAvatar} />
              </IconButton>
              {/* dropdown menu */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
                className={classes.popupMenu}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Menu>
            </div>
          ): (
            <IconButton
            to='/login'
            component={Link}
            color="inherit"
            style={{ textDecoration: 'none' }}>
                <i className="fas fa-sign-in-alt"></i>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
  );
}