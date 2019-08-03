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
    this.htmlBody = document.body
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
    } else if (type === 'more' && selectVal.length > 0) {
       newTitleSelectedStatus[type] = true
     }
      
    else {
      // 不选中
      newTitleSelectedStatus[type] = false
    }
    
    return newTitleSelectedStatus
  }

  // 切换标题高亮
  // 参数 type 表示：当前点击菜单的类型
  changeTitleSelected = type => {
    this.htmlBody.className = 'hidden'

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
    this.htmlBody.className = ''

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
      openType: "",
      titleSelectedStatus:{...titleSelectedStatus,...newTitleSelectedStatus},
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
    // console.log(type,value);
    const { titleSelectedStatus,selectedValues} = this.state
    
    // 对象无法直接遍历，需要用 forEach 
    //  Object.keys(titleSelectedStatus) => ['area','mode','price','more']  ----对象转成数组
    const newTitleSelectedStatus = this.getTitleSelectedStatus(type,value)
  
    const newSelectedValues = {
      ...selectedValues,
      [type]:value
    }
    // console.log(newTitleSelectedStatus);
     // 这是传递给父组件的筛选条件对象
    const filters = {}

    // console.log(key)
    // 处理：区域或地铁
    // area -> ["area", "null"] 或 ["subway", "null"]
    const area = newSelectedValues.area
    const areaKey = area[0]
    let areaValue
    // 如果数组长度为 2 ，就为：null
    // 如果数组长度为 3 ，先判断最后一项是否为 null ，如果是，就拿倒数第二项
    //                                             否则，就获取最后一项的值
    if (area.length === 2) {
      areaValue = 'null'
    } else if (area.length === 3) {
      areaValue = area[2] === 'null' ? area[1] : area[2]
    }
    // 添加到对象中
    filters[areaKey] = areaValue

    // 处理方式和租金
    filters.rentType = newSelectedValues.mode[0]
    filters.price = newSelectedValues.price[0]

    // 处理更多筛选条件数据
    filters.more = newSelectedValues.more.join(',')

    this.props.onFilter(filters)

    // console.log('最新筛选条件为：', newSelectedValues, filters)

    this.setState({
      // titleSelectedStatus: {
      //   ...this.state.titleSelectedStatus,
      //   [type] : true
      // },
      titleSelectedStatus:{...titleSelectedStatus,...newTitleSelectedStatus},
      openType: "",
      selectedValues:newSelectedValues
    })
    
    // console.log(this.state);
  }
 
  // 渲染 前面三个菜单对应的组件 
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    if (openType === 'more' || openType === '') {
      return null
    }

    // 从 filtersData 中获取数据
    // area： area => {}, subway => {}
    // mode： rentType => []
    // price：price => []
    let data
    // 列数
    let cols = 1
    // 当前选中值
    let defaultValue = selectedValues[openType]

    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        break
      case 'price':
        data = price
        break
      default:
        break
    }

    return (
      <FilterPicker
        key={openType}
        data={data}
        cols={cols}
        onCancel={this.onCancel}
        onSave={this.onSave}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }
  // 渲染 第四个菜单对应的组件
  renderFilterMore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues
    } = this.state

    if (openType !== 'more') return null
    
    
    const data = { roomType, oriented, floor, characteristic }

    const defaultValue = selectedValues.more
  
   return <FilterMore data={data} selectedValues={selectedValues} onSave={this.onSave} type={openType} onCancel = {this.onCancel}  defaultValue={defaultValue} />
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
