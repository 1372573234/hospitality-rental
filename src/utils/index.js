import axios from "axios"

import { getCity, setCity } from "./city"

const BMap = window.BMap;

const getCurrentCity = () => {
  // const curCity = JSON.parse(localStorage.getItem("hkzf_city"))
  const curCity = getCity()

  if (!curCity) {
    return new Promise(resolve => {
      const myCity = new BMap.LocalCity()
      myCity.get(async result => {
        const res = await axios.get("http://localhost:8080/area/info", {
          params: {
            name:result.name
          }
        })
        console.log('当前城市信息' + res);
        
        const { label, value } = res.data.body
        
        resolve({ label, value })
        
        setCity({label,value})
        // localStorage.setItem("hfzk_city",JSON.stringify({label,value}))
      })
    })
  } else {
    return Promise.resolve(curCity)
  }
}

export { getCurrentCity, getCity, setCity }
export { BASE_URL } from './url.js'
export { API } from './api.js'