const TOKEN = 'hkzf_token';

export const getToken = () =>localStorage.getItem(TOKEN)

export const setToken = token => localStorage.setItem(TOKEN, token)

export const removeToken = () => localStorage.removeItem(TOKEN)

// 判断是否含有token
export const isAuth = () => !!getToken()

