import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Route,Redirect } from "react-router-dom"

import Home from "./pages/Home/index"
// import CityList from "./pages/CityList/index"
// import Map from "./pages/Map/index"
// import HouseList from './pages/HouseList/index'
// import HouseDetail from "./pages/HouseDetail/index"
// import Login from './pages/Login/index'

// import AuthRoute from './components/AuthRoute/index'

// import Rent from './pages/Rent/index'
// import RendSearch from "./pages/Rent/Search/index"
// import RendAdd from "./pages/Rent/Add/index"

const CityList = lazy(() => import('./pages//Login'))

const Map = lazy(() => import( "./pages/Map/index"))
const HouseList = lazy(() => import( './pages/HouseList/index'))
const HouseDetail = lazy(() => import( "./pages/HouseDetail/index"))
const Login = lazy(() => import( './pages/Login/index'))
const AuthRoute = lazy(() => import( './components/AuthRoute/index'))
const Rent = lazy(() => import( './pages/Rent/index'))
const RendSearch = lazy(() => import( "./pages/Rent/Search/index"))
const RendAdd = lazy(() => import( "./pages/Rent/Add/index"))



export default class App extends React.Component{
  render() {
    return (
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="app">
          {/* <Link to="/home">首页</Link>
          <Link to="/citylist">城市选择</Link> */}
          <Route exact path="/" render = {() => <Redirect to="/home"></Redirect> } ></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/citylist" component={CityList}></Route>
          <Route path="/map" component={Map} ></Route>
          <Route path="/houselist" component={HouseList} ></Route>
          <Route path="/details/:id" component={HouseDetail} />
          <Route path="/login" component={Login} />

          <AuthRoute exact path="/rent" component={Rent}></AuthRoute>
          <AuthRoute path="/rent/add" component={RendAdd}></AuthRoute>
          <AuthRoute path="/rent/search" component={RendSearch}></AuthRoute>
        </div>
        </Suspense>
      </Router>
    )
  }
}