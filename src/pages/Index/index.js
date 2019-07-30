import React from "react"

import { Carousel,Flex,Grid,WingBlank   } from 'antd-mobile';

import { Link } from "react-router-dom";

// import axios from 'axios'
import SearchHeader from '../../components/SearchHeader/index'

import "./index.scss"

import nav1 from "../../assets/images/nav-1.png"
import nav2 from "../../assets/images/nav-2.png"
import nav3 from "../../assets/images/nav-3.png"
import nav4 from "../../assets/images/nav-4.png"
import { getCurrentCity,BASE_URL,API } from "../../utils";
 

// const BMap = window.BMap

class Index extends React.Component{

  state = {
    news:[],
    groups:[],
    data: [],
    imgHeight: 212,
    isSwiperLoading: true,
    cityName:"上海"
  }

  async getSwipers() {
    const res = await API.get('/home/swiper')
    // console.log(res);
    this.setState({
      data:res.data.body,
      isSwiperLoading:false
    })
  }

  async getGroups() {
    const res = await API.get("/home/groups?area=AREA%7C88cff55c-aaa4-e2e0")
    // console.log(res);
    this.setState({
      groups:res.data.body
    })
  }

  async getNews() {
    const res = await API.get("/home/news?area=AREA%7C88cff55c-aaa4-e2e0")
    // console.log(res);
    this.setState({
      news:res.data.body
    })
  }

  async componentDidMount() {
  // simulate img loading
    this.getSwipers()
    this.getGroups()
    this.getNews()

    const { label } = await getCurrentCity()
    this.setState({
      cityName:label
    })
    // navigator.geolocation.getCurrentPosition(position => {
    //   // postion 对象中，常用属性的文档：
    //   // https://developer.mozilla.org/zh-CN/docs/Web/API/Coordinates
    //   console.log('当前位置信息：', position)
    // })
    
    // const myCity = new BMap.LocalCity()
    //   myCity.get(async (result) => {
    //   const cityName = result.name
    //   // console.log('当前定位城市名称为：', cityName)
    //     const res = await axios.get("http://localhost:8080/area/info", {
    //       params: {
    //         name:cityName
    //       }
    //     })
    //     const {label,value} = res.data.body
    //     // console.log(label,value);
    //     localStorage.setItem('hfzk_city',JSON.stringify({label,value}))
    // })
  }

  renderSwipper() {
    return (
      this.state.data.map(val => (
            <a
              key={val.id}
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={`${BASE_URL}${val.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))
    )
  }

  renderNews() {
    return this.state.news.map(item => (
      <div className='news-item' key={item.id}>
        <div className="imgwrap">
          <img src={`${BASE_URL}${item.imgSrc}`} alt=""/>
        </div>
        <Flex className="content" justify="between" direction="column" align="center">
          <h3>{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
  </div>
    ))
  }

  render() {
    return (
      <div>
        <div className='swiper'>
          {/* 轮播图 */}
          {this.state.isSwiperLoading ? null : (<Carousel
          autoplay={true}
          infinite
           autoplayInterval={5000}
        >
          {this.renderSwipper()}
          </Carousel>)}
          {/* 搜索栏 */}
          <SearchHeader cityName={this.state.cityName}></SearchHeader>
          {/* <Flex className="search-box">
            <Flex className="search">
              <div className="location"
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className="name">{this.state.cityName}</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              <div className="form" onClick={() => this.props.history.push('/search')}>
                <i className="iconfont icon-seach"></i>
                <span className="text">
                  请输入小区地址
                </span>
              </div>
            </Flex>
            <i className="iconfont icon-map" onClick={() => this.props.history.push('/map') }></i>
         </Flex> */}
        </div>

        {/* 导航栏  */}
        <div className="nav">
            <Flex>
            <Flex.Item>
              <Link to="/home/list">
                <img src={nav1} alt="" />
                <p>整租</p>
              </Link>
            </Flex.Item>
            <Flex.Item>
              <Link to="/home/list">
                <img src={nav2} alt="" />
                <p>合租</p>
              </Link>
              </Flex.Item>
            <Flex.Item>
              <Link to="/map">
                <img src={nav3} alt="" />
                <p>地图找房</p>
              </Link>
              </Flex.Item>
            <Flex.Item>
              <Link to="/home/list">
                <img src={nav4} alt="" />
                <p>去出租</p>
              </Link>
              </Flex.Item>
            </Flex>
        </div>

        {/* 房屋租赁 */}
        <div className="groups">
           <Flex justify="between" className="groups-title">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>

          <Grid data={this.state.groups} columnNum={2}
            className="grid"
            square={false}
            hasLine={false}
            renderItem={(el) => (
              <div>
                <div className="desc">
                 <p>{el.title}</p>
                  <span>{el.desc}</span>
                </div>
                <img src={`${BASE_URL}${el.imgSrc}`} alt="" />
              </div>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <Flex justify="between" className="news-title">
            <h3>最新资讯</h3>
          </Flex>
         <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
        

      </div>
    )
  }
}
export default Index