import React from 'react'

import { Flex,Toast } from 'antd-mobile'

import {List,AutoSizer,WindowScroller,InfiniteLoader} from 'react-virtualized'

import SearchHeader from '../../components/SearchHeader/index'

import Filter from "./components/Filter/index"

import HouseItem from "../../components/HouseItem/index"

import Sticky from "../../components/Sticky/index"

import NoHouse from '../../components/NoHouse/index'

import styles from "./index.module.scss"
import { getCurrentCity,API,BASE_URL } from '../../utils';

const HOUSE_ITEM_HEIGHT = 120

export default class HouseList extends React.Component {
  state = {
    list: [],
    count: 0,
    // 默认数据是否加载完成
    isLoaded:false
  }

  filters = {}

  label = ""
  value=""

  async componentDidMount() {
    const { value, label } = await getCurrentCity()
    this.value = value
    this.label = label

    this.searchHouseList()
  }

  onFilter = filters => {
    this.filters = filters
    // 调用查询房源数据的方法
    this.searchHouseList()
    // 回到页面顶部
    window.scrollTo(0, 0)
  }

  async searchHouseList(start = 1, end = 20) {
    Toast.loading('加载中...', 0, null, false)
    // const { value } = await getCurrentCity()
    const res = await API.get('/houses', {
      params: {
        ...this.filters,
        cityId: this.value,
        start,
        end
      }
    })
    Toast.hide()
    console.log('获取到的数据',res);
    const { list, count } = res.data.body
    
    if (count > 0) {
      Toast.info(`有${count}套房源`,1.5,null,false)
    }

    this.setState({
      list,
      count,
      isLoaded:true
    })
  }

  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]

    
    if (!item) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }

   

    return (
      <HouseItem
        key={key}
        style={style}
        {...item}
        houseImg={`${BASE_URL}${item.houseImg}`}
        onclick={()=> this.props.history.push(`/details/${item.houseCode}`)}
      ></HouseItem>
    )
  }

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  loadMoreRows = ({ startIndex,stopIndex }) => {
    return new Promise(async resolve => {
      const { value } = await getCurrentCity()
      
      const res = await API.get('/houses', {
        params: {
          ...this.filters,
          cityId: value,
          start: startIndex + 1,
          end:stopIndex
        }
      })
      resolve()
      const { count, list } = res.data.body
      this.setState({
        list: [...this.state.list, ...list],
        count
      })
    })
  }

  renderHouseList() {
    const { count, isLoaded } = this.state
    
    if (isLoaded && count <= 0) {
      return (
        <NoHouse>没有响应的房源数据</NoHouse>
      )
    }

    return (
       <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={count}
          minimumBatchSize={21} // 每次额外加载的最小条数
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, scrollTop }) => {
                // console.log('WindowScroller:', height)
                return (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        width={width}
                        autoHeight
                        height={height}
                        rowCount={count}
                        rowHeight={HOUSE_ITEM_HEIGHT}
                        rowRenderer={this.rowRenderer}
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                      />
                    )}
                  </AutoSizer>
                )
              }}
            </WindowScroller>
          )}
        </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 顶部搜索导航栏 */}
        <Flex className={styles.listHeader}>
          <i className="iconfont icon-back" onClick = {() => this.props.history.go(-1)}></i>
          <SearchHeader cityName={this.label} className={styles.listSearch} ></SearchHeader>
        </Flex>

        <Sticky height={40}>
          {/* 条件筛选栏组件 */}
          <Filter onFilter={this.onFilter} />
        </Sticky>
        
        {/* 房源列表 */}
        <div className={styles.houseList}>{this.renderHouseList()}</div>

      </div>
    )
  }
}

