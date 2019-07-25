import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom'
var emitter = require('../config/global_emitter')


export default function MenuAppBar(props) {
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
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
                <i className="fa fa-sign-in" aria-hidden="true"/>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
  );
}