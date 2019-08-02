import React from 'react'
import Slider from 'react-slick'
import { makeStyles } from '@material-ui/core/styles'
import Apex from '../assets/carousel/apex.png'
import Fornite from '../assets/carousel/fortnite.png'
import Clash from '../assets/carousel/clashroyale.png'
import Rainbow from '../assets/carousel/rainbowsix.png'
import Fifa from '../assets/carousel/fifa19.png'
import Lol from '../assets/carousel/lol.png'

import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles({
    games: {
        '&:active': {
            transform: 'scale(1.2)',
            transition: 'all 0.2s ease-out'
        }
    }
})

export default function Carousel(){
    const classes = useStyles()
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3
    }
    return(
        <div className='mt-3'>
            <h4 className='text-white text-shadow text-center'>Choose your game!</h4>
            <Slider {...settings} className='text-center'>
                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.games}
                >
                    <img height='120' src={Apex} alt='apex'/>
                </IconButton>
                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.games}
                >
                    <img height='120' src={Fornite} alt='fortnite'/>
                </IconButton>
                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.games}
                >
                    <img height='120' src={Clash} alt='clash'/>
                </IconButton>
                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.games}
                >
                    <img height='120' src={Rainbow} alt='rainbow'/>
                </IconButton>
                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.games}
                >
                    <img height='120' src={Fifa} alt='fifa'/>
                </IconButton>
                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.games}
                >
                    <img height='120' src={Lol} alt='lol'/>
                </IconButton>
                
            </Slider>
        </div>
    )
}