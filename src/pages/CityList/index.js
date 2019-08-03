import React from "react"

import { Toast } from 'antd-mobile';

import { AutoSizer,List } from "react-virtualized"

import axios from 'axios'

import {getCurrentCity,setCity } from "../../utils/index"

import NavHeader from "../../components/NavHeader/index"

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

const formatCityIndex = letter => {
  // console.log(letter);
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase()
  }
}

const INDEX_HEIGHT = 36;
const CITY_NAME_HEIGHT = 50;
const CITY_HAS_HOUSE = ['北京','上海','广州','深圳']

class CityList extends React.Component{
  state = {
    cityList: {},
    cityIndex: [],
    activeIndex:0
  }

  listRef = React.createRef()
  
  componentDidMount() {
    this.fetchCityList()
  }

  async fetchCityList() {
    Toast.loading('加载中...', 0, false, null)
    const res = await axios.get("http://localhost:8080/area/city?level=1")
    // console.log(res);

    const { cityList, cityIndex } = formatCityList(res.data.body)

    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // hot 作为热门城市的索引
    // 注意索引顺序
    cityIndex.unshift('hot')
    cityList['hot'] = hotRes.data.body

    // console.log(cityIndex,cityList);
    Toast.hide()
    const curCity = await getCurrentCity()
    cityIndex.unshift('#')
    cityList['#'] = [curCity]
    this.setState({
      cityList,
      cityIndex
    })
  }

  changeCity = ({ label,value }) => {
    if (CITY_HAS_HOUSE.indexOf(label) > -1) {
      setCity({ label, value })
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂时无房源数据',1, null, false);
   
    }
  }

  rowRenderer = ({ key,index,style}) => {
    const { cityList, cityIndex } = this.state
    // console.log(cityList,cityIndex);
    const letter = cityIndex[index]
    const list = cityList[letter]
    // console.log(letter, list);
    return (
      <div className="city" key={key} style={style}>
        <div className="title">
        {formatCityIndex(letter)}
        </div>
        {list.map(item => (
          <div className="name"
            key={item.value}
            onClick= { () => this.changeCity(item) }
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  calcRowHeight = ({ index}) => {
    const { cityIndex,cityList } = this.state
    const letter = cityIndex[index]
    const list = cityList[letter]
    return INDEX_HEIGHT + CITY_NAME_HEIGHT * list.length

  }

  goToCityIndex = index => {
    return this.listRef.current.scrollToRow(index)
  }

  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item,index) => (
      <li className="city_index_item"
        key={item}
        onClick = { () => this.goToCityIndex(index)}
      >
        <span className={index === activeIndex ? 'index_active' : ""}>

          {item === "hot" ? '热':item.toUpperCase()}
        </span>
      </li>
    ))
  }

  onRowsRendered = ({ startIndex }) => {
    // console.log(startIndex);

    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex:startIndex
      })
    }
  }

  render() {
    return (
      <div className="citylist">
        <NavHeader>城市选择</NavHeader>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref = {this.listRef}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered = {this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        <ul className="city_index">
          {this.renderCityIndex()}
        </ul>
        
  
      </div>
    )
  }
}
export default CityList