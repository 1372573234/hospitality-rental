/* 
  条件筛选栏 - 父组件
*/
import React, { Component } from 'react'


import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { API,getCurrentCity } from "../../../../utils/index"

import styles from './index.module.css'


// 条件状态
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

// 选中值状态
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more:[]
}

export default class Filter extends Component {
  state = {
    // 标题高亮数据
    titleSelectedStatus,
    // 战术对话框的类型，可能是 FilterPicker 可能是 FilterMore
    openType: "",
    filtersData: {},
    selectedValues
  }

  componentDidMount() {
    this.getFilterData()
  }
  
  
  async getFilterData() {
    const { value } = await getCurrentCity()
    // console.log(value);
    const res = await API.get('/houses/condition', {
      params: {
        id: value
      }
    })
    // console.log(res);
    this.setState({
      filtersData: res.data.body
    })
  }

  // 封装菜单高亮状态
  getTitleSelectedStatus(type, selectVal) {
    const newTitleSelectedStatus = {}
    if (type === 'area' && (selectVal.length === 3 || selectVal[0] === 'subway')) {
      // 有选中
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectVal[0] !== 'null') {
      // 有选中
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more') { }
      
    else {
      // 不选中
      newTitleSelectedStatus[type] = false
    }
    
    return newTitleSelectedStatus
  }

  // 切换标题高亮
  // 参数 type 表示：当前点击菜单的类型
  changeTitleSelected = type => {
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    // 对象无法直接遍历，需要用 forEach 
    //  Object.keys(titleSelectedStatus) => ['area','mode','price','more']  ----对象转成数组
    Object.keys(titleSelectedStatus).forEach(item => {
      // console.log(item)
      // value 当前type的选中值
      const selectVal = selectedValues[item]
      if (item === type) {
        // 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）
        newTitleSelectedStatus[type] = true
      } else {
        const selected = this.getTitleSelectedStatus(item, selectVal)
        // 将 selected 中的属性添加到  newTitleSelectedStatus 中，重名的属性后面的覆盖前面的
        Object.assign(newTitleSelectedStatus, selected)
      }
    
      // console.log(newTitleSelectedStatus);

      this.setState({
        // titleSelectedStatus: {
        //   ...this.state.titleSelectedStatus,
        //   [type] : true
        // },
        titleSelectedStatus: newTitleSelectedStatus,
        openType: type
      })
    })
  }

  // 取消按钮的事件
  onCancel = type => {
    // this.setState({
    //   openType:""
    // })
    const { titleSelectedStatus,selectedValues } = this.state
    const selectVal = selectedValues[type]
    // 对象无法直接遍历，需要用 forEach 
    //  Object.keys(titleSelectedStatus) => ['area','mode','price','more']  ----对象转成数组
    const newTitleSelectedStatus =  this.getTitleSelectedStatus(type,selectVal)
  
    
    // console.log(newTitleSelectedStatus);

    this.setState({
      // titleSelectedStatus: {
      //   ...this.state.titleSelectedStatus,
      //   [type] : true
      // },
      titleSelectedStatus:{...titleSelectedStatus,...newTitleSelectedStatus},
      openType: "",
      
    })
  }

  // 保存按钮的事件
  onSave = (type, value) => {
    // 从 FilterPicker 中拿到数据
    // console.log('保存的数据', type, value);
   
    //  this.setState({
    //    openType: "",
    //    selectedValues: {
    //      ...this.state.selectedValues,
    //      [type]:value
    //    }
    //  })
    
    // 注意：此处不要依赖于状态中的选中值，而是应该依赖于传递过来的参数 value ,它才表示最新值
    const { titleSelectedStatus} = this.state
    
    // 对象无法直接遍历，需要用 forEach 
    //  Object.keys(titleSelectedStatus) => ['area','mode','price','more']  ----对象转成数组
    const newTitleSelectedStatus = this.getTitleSelectedStatus(type,value)
  
    
    // console.log(newTitleSelectedStatus);

    this.setState({
      // titleSelectedStatus: {
      //   ...this.state.titleSelectedStatus,
      //   [type] : true
      // },
      titleSelectedStatus:{...titleSelectedStatus,...newTitleSelectedStatus},
      openType: "",
      selectedValues: {
        ...this.state.selectedValues,
        [type]:value
      }
    })
    
    // console.log(this.state);
  }
 
  // 渲染 前面三个菜单对应的组件 
  renderFilterPicker() {

    const {
      openType,
      filtersData: { area, price, rentType, subway },
      selectedValues
    } = this.state

    if(openType === 'more' || openType === '') {
      return null
    }
    
    let data
    let cols = 1

    let defaultValue = selectedValues[openType]

    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        data = rentType
        break;
      case 'price':
        data = price
        break;
      default:
        break;
    }

    return (
      <FilterPicker
        // react 会根据 key 是否相同，相同复用，不同则会删除新建
        key={openType}
        data={data}
        cols={cols}
        onCancel={this.onCancel}
        onSave={this.onSave}
        type={openType}
        defaultValue={defaultValue}
       
      />)
  }

  // 渲染 第四个菜单对应的组件
  renderFilterMore() {
    const {
      openType,
      filtersData:{roomType, oriented, floor, characteristic}
    } = this.state

    if (openType !== 'more') return null
    
    
    const data = { roomType, oriented, floor, characteristic }
  
   return <FilterMore data={data} />
  }

  render() {
    const { titleSelectedStatus, openType } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        { openType === 'area' || openType === 'mode' || openType === 'price' ? (<div className={styles.mask} onClick={this.onCancel} />) : null }
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
           onClick={this.changeTitleSelected}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}
         
          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
