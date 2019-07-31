import React from 'react'
import Slider from 'react-slick'
import Apex from '../assets/carousel/apex.png'
import Fornite from '../assets/carousel/fortnite.png'
import Clash from '../assets/carousel/clashroyale.png'
import Rainbow from '../assets/carousel/rainbowsix.png'
import Fifa from '../assets/carousel/fifa19.png'
import Lol from '../assets/carousel/lol.png'

export default function Carousel(){
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
                <div><img height='120' src={Apex} alt='apex'/></div>
                <div><img height='120' src={Fornite} alt='fortnite'/></div>
                <div><img height='120' src={Clash} alt='clash'/></div>
                <div><img height='120' src={Rainbow} alt='rainbow'/></div>
                <div><img height='120' src={Fifa} alt='fifa'/></div>
                <div><img height='120' src={Lol} alt='lol'/></div>
            </Slider>
        </div>
    )
}