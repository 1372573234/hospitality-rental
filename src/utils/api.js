import axios from 'axios'
import { BASE_URL } from "./url"
import { getToken,removeToken } from "./token"


const API = axios.create({
  baseURL:BASE_URL
})

API.interceptors.request.use(config => {
  // console.log(config)
  /*
  获取到当前请求的接口路径（url）。
  ③ 判断接口路径，是否是以 /user 开头，并且不是登录或注册接口（只给需要的接口添加请求头）。
  ④ 如果是，就添加请求头 Authorization。
  */
  const { url } = config
  if (url.startsWith('/user') && !(url.startsWith('/user/login') || url.startsWith('/user/registered'))) {
    config.headers.authorization = getToken()
  }
  return config
})

API.interceptors.response.use(res => {

  /*
  ⑤ 添加响应拦截器。
  ⑥ 判断返回值中的状态码。
  ⑦ 如果是 400，表示 token 超时或异常，直接移除 token
   */

  // console.log(res);

  if (res.data.status === 400) {
    removeToken()
  }
  return res

})

export { API }