import React from "react"

import { NavBar } from 'antd-mobile';

import { List } from "react-virtualized"

import axios from 'axios'

import {getCurrentCity } from "../../utils/index"

import "./index.scss"

const formatCityList = list => {
  const cityList = {}
  list.forEach(item => {
    const firstLetter = item.short.substr(0, 1)
    if (firstLetter in cityList) {
      // 直接追加到当前数组中
      cityList[firstLetter].push(item)
    } else {
      // 没有，就给 cityList 添加当前索引 (key) ，并且把当前城市添加到数组中
      // 给对象添加属性，键为当前首字母
      // 给这个键添加值，值是一个数组，并且要把当前城市一起添加到数组中
      cityList[firstLetter]= [item]
    }
  })
  // 获取城市索引
  // Object.keys(obj) 作用：获取对象中所有的键，并且放到一个数组中返回
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

const list = Array.from(new Array(1000)).map((item, index) => `${index}----react-virtualized 组件列表项`)

function rowRenderer({
   key, // 每一项的唯一标识
  index, // 每一行的索引号
  isScrolling, // 表示当前行是否正在滚动，如果是滚动结果为true；否则，为false
  isVisible, // 当前列表项是否可见
  style // Style object to be applied to row (to position it)
}) {
  return (
    <div key={key} style={style}>
      {list[index]} --- {isScrolling+''}---{isVisible + ''}
    </div>
  )
}

class CityList extends React.Component{
  state = {
    cityList: {},
    cityIndex:[]
  }
  
  componentDidMount() {
    this.fetchCityList()
  }

  async fetchCityList() {
    const res = await axios.get("http://localhost:8080/area/city?level=1")
    // console.log(res);

    const { cityList, cityIndex } = formatCityList(res.data.body)

    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // hot 作为热门城市的索引
    // 注意索引顺序
    cityIndex.unshift('hot')
    cityList['hot'] = hotRes.data.body

    // console.log(cityIndex,cityList);

    const curCity = await getCurrentCity()
    cityIndex.unshift('#')
    cityList['#'] = [curCity]
    this.setState({
      cityList,
      cityIndex
    })
  }


  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => console.log('onLeftClick')}
        >
          城市选择
          </NavBar>
         <List
          width={375}
          height={300}
          rowCount={list.length}
          rowHeight={20}
          rowRenderer={rowRenderer}
              />
      </div>
    )
  }
}
export default CityList