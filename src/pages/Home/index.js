import React, { lazy } from "react"
import { Route} from "react-router-dom"

import { TabBar } from 'antd-mobile';


// import List from "../HouseList/index"
// import News from "../News/index"
// import Profile from "../Profile/index"
import Index from "../Index/index"

import "./index.css"

const List = lazy(() => import('../HouseList/'))
const News = lazy(()=> import('../News/'))
const Profile = lazy(()=> import('../Profile/'))

const TABBARLIST = [
   { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/list' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' }
]

class Home extends React.Component{


  state = {
    selectedTab: this.props.location.pathname,
    hidden: false,
    fullScreen: true,
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        selectedTab:this.props.location.pathname
      })
    }
  }

  renderTabBarItems = () => {
    return TABBARLIST.map(item => (
         <TabBar.Item
            title={item.title}
            key={item.path}
            icon={<i className={`iconfont ${item.icon}`} />}
            selectedIcon={<i className={`iconfont ${item.icon}`} />}
            selected={this.state.selectedTab === item.path}
           
            onPress={() => {
              this.props.history.push(item.path)
              this.setState({
                selectedTab:item.path,
              });
            }}
           
          >
          </TabBar.Item>
    ))
  }

 

  render() {
    return (
      <div className="home">
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={List}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
       
       <div className="tabbar">
        <TabBar
          tintColor="#21B97A"
          noRenderContent={true}          
          >
            {this.renderTabBarItems()}
        </TabBar>
      </div>
         
      </div>
    )
  }
}
export default Home