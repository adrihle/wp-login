import React from 'react'
import posed from 'react-pose'
import ProfileCard from '../components/ProfileCard'
import GameSlider from '../components/GameSlider'

const Container = posed.div({
    enter: { staggerChildren: 50 }
})

const Fields = posed.div({
    enter: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 }
})



export default function Dashboard() {
    const userName = localStorage.getItem('userName')

    return(
        <Container>
            <Fields>
                {userName!==null ? 
                    (<GameSlider />)
                    :
                    (<h3 className='text-white p-3'>Dashboard</h3>)}
            </Fields>
        </Container>
    )
}