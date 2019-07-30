import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'


export default class FilterPicker extends Component {
  // 当 react 中的 key 发生变化，会新建
    state = {
      // value 用来获取 PickerView 组件中选中的值
      value: this.props.defaultValue
    }

  //  constructor(props) {
  //   super(props)
  //   console.log('FilterPicker 组件接收到默认值为：', this.props.defaultValue)
    //   this.state ={
    //   // value 用来获取 PickerView 组件中选中的值
    //   value: this.props.defaultValue
    // }
  // }

  // componentDidUpdate(prevProps) {
  //   // console.log('切换组件了')
  //   const { defaultValue } = this.props
  //   // console.log(defaultValue, prevProps.defaultValue)
  //   if (defaultValue !== prevProps.defaultValue) {
  //     this.setState({
  //       value:defaultValue
  //     })
  //   }
  // }

  // 当 FilterView 发生变化时，实时更新默认值
  onChange = val => {
    this.setState({
      value:val
    })
  }
 
  
  render() {
    const { onCancel, onSave,data,cols,type } = this.props
    const {value} = this.state
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={value} cols={cols} onChange={this.onChange} />

        {/* 底部按钮 */}
        <FilterFooter onCancel={() => onCancel(type)}
          onSave={() => onSave(type, value)} />
          {/* 点击保存时，拿到type 和 value(实时更新的value) */}
      </>
    )
  }
}
