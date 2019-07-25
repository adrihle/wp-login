import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import posed, { PoseGroup } from 'react-pose'
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import NavBar from './components/Navbar'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const RouteContainer = posed.div({
    enter:{
        opacity: 1, delay: 100
    },
    exit: {
        opacity: 0
    }
})

export default function Routes(){
    return(
        <Router history={history}>
            <NavBar history={history}/>
            <Route
                render={({ location }) => (
                    <div id="site-container">
                        <PoseGroup>
                            <RouteContainer key={location.pathname}>
                            <Switch location={location}>
                                <Route exact path="/" component={Dashboard} key="home" />
                                <Route path="/login" component={Login} key="about" />
                            </Switch>
                            </RouteContainer>
                        </PoseGroup>
                    </div>
                )}/>
        </Router>
    )
}