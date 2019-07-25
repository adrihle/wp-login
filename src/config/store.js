export const isLogIn = () => {
    return localStorage.getItem('token')
}

export const getUser = () => {
    return localStorage.getItem('userName')
}