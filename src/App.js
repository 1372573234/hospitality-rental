import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import Home from "./pages/Home/index"
import CityList from "./pages/CityList/index"
import List from "./pages/List/index"

export default class App extends React.Component{
  render() {
    return (
      <Router>
        <div>
          <Link to="/home">首页</Link>
          <Link to="/list">城市选择</Link>

          <Route path="/home" component={Home}></Route>
          <Route path="/list" component={CityList}></Route>

          <Route path="/home/list" component={List}></Route>

        </div>
      </Router>
    )
  }
}