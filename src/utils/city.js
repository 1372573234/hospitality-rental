const CITY_KEY = 'hkzf_city';

export const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY))

export const setCity = () => JSON.stringify(localStorage.setItem(CITY_KEY))