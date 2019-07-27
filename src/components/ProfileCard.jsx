import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import posed from 'react-pose'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Moment from 'react-moment'
import {ReactComponent as Rango1} from '../assets/svg/002-cheuron.svg'
import { ReactComponent as Achi1 } from '../assets/svg/004-pistola.svg'
import { ReactComponent as Achi2 } from '../assets/svg/010-paracaidas.svg'
import { ReactComponent as Achi3 } from '../assets/svg/016-matar.svg'

const Container = posed.div({
    enter: { staggerChildren: 50 }
})

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    marginTop: 30,
    background: 'rgba(0,0,0,0.2)'
  },
  title: {
    fontSize: 14,
    color: 'white',
    textShadow: '2px 2px rgba(0,0,0,0.5)'
  },
  since: {
    fontStyle: 'italic', 
    color: 'white',
    fontSize: 19,
    textShadow: '2px 2px rgba(0,0,0,0.5)'
  },
  user: {
      fontSize: 36,
      color: 'white',
      fontWeight: 'bold',
      textShadow: '2px 2px rgba(0,0,0,0.5)'
  },
  stackCoin: {
    color: 'white',
    textShadow: '2px 2px rgba(0,0,0,0.5)',
  },
  Avatar: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  rank: {
      fontSize: 15,
      color: 'white',
      textShadow: '2px 2px rgba(0,0,0,0.5)',
  },
  aka: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white'
  },
  icons: {
    filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))',
    WebkitFilter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))',
  },
  latestAchievement: {
      fontSize: 15,
      color: 'white',
      textShadow: '2px 2px rgba(0,0,0,0.5)',
  }
});

const toUpperCaseFilter = (d) => {
    return d.toUpperCase();
};


export default function SimpleCard() {
  const classes = useStyles();

  return (
    <Container>
        <Card className={classes.card}>
            <CardContent className={classes.content}>
                <Grid container direction='column' justify='center' alignItems='center'>
                    <Avatar alt='Profile Picture' src={localStorage.getItem('urlAvatar')} className={classes.Avatar}/>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName')}
                    </Typography>
                    <Typography variant="h5" component="h2" className={classes.user}>
                        @{localStorage.getItem('userName')}
                    </Typography>
                    <Grid container justify='space-evenly' alignItems='center' className='mt-3 mb-2'>
                        <Typography className={classes.since} color="textSecondary">
                            Since:
                                    <Moment 
                                        format=' MMMM YY'
                                        filter={toUpperCaseFilter}
                                        >
                                            {' ' + localStorage.getItem('since')}</Moment>
                                </Typography>
                                <Typography variant="h6" component="h2" className={classes.stackCoin}>
                                    <i className="fas fa-coins pr-2"></i>
                                    {localStorage.getItem('creditAmount')}
                                </Typography>
                    </Grid>
                                
                    <div className='container border border-light mt-3 mb-3'>
                        <div className='row pt-3 pb-3'>
                            <div className='col text-center'>
                                <Typography variant='h6' component='h5' className={classes.rank}>
                                    battle rank
                                </Typography>
                                <div className='mt-2 mb-2'>
                                     <Rango1 fill='white' width='30px' height='30px' className={classes.icons}/>
                                </div>
                            </div>
                            <div className='col text-center'>
                                <Typography variant='h6' component='h5' className={classes.latestAchievement}>
                                    latest achievements 
                                </Typography>
                                <div className='mt-2 mb-2'>
                                     <Achi1 fill='white' width='30px' height='30px' className={classes.icons}/>
                                     <Achi2 fill='white' width='30px' height='30px' className={classes.icons}/>
                                     <Achi3 fill='white' width='30px' height='30px' className={classes.icons}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>   
            </CardContent>
        </Card>
    </Container>
  );
}