import React from "react"
import { BrowserRouter as Router, Route,Redirect } from "react-router-dom"

import Home from "./pages/Home/index"
import CityList from "./pages/CityList/index"

export default class App extends React.Component{
  render() {
    return (
      <Router>
        <div>
          {/* <Link to="/home">首页</Link>
          <Link to="/citylist">城市选择</Link> */}
          <Route exact path="/" render = {() => <Redirect to="/home"></Redirect> } ></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/citylist" component={CityList}></Route>

          

        </div>
      </Router>
    )
  }
}