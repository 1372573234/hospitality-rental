import React from "react"
import { Route } from "react-router-dom"

import List from "../List/index"
import News from "../News/index"
import Index from "../Index/index"
import Profile from "../Profile/index"

class Home extends React.Component{
  render() {
    return (
      <div>
        <h1>这是Home页面</h1>
        <Route path="/home/list" component={List}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/index" component={Index}></Route>
        <Route path="/home/profile" component={Profile}></Route>
      </div>
    )
  }
}
export default Home