import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {

  state = {
    selectedValues:this.props.defaultValue
  }

  handleChange(id) {
    const { selectedValues } = this.state
    let newSelectValue = [...selectedValues]
    if (selectedValues.indexOf(id) > -1) {
      // 包含，就移除---类似 toggle 的效果
      newSelectValue = newSelectValue.filter(item => item !== id)
    } else {
      // 不包含直接添加到数组中
      newSelectValue.push(id)
    }
    // console.log(newSelectValue)
    this.setState({
      selectedValues:newSelectValue
    })
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const { selectedValues } = this.state
      const isSelected = selectedValues.indexOf(item.value) > -1

      return (
        <span
          key={item.value}
          className={[styles.tag,isSelected ? styles.tagActive:" "].join(' ')} onClick={() => this.handleChange(item.value)}  >
          {item.label}
        </span>
      )
    })
  }


  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      type, onSave,onCancel
    } = this.props

    const { selectedValues } = this.state

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
       <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} cancelText="清除" onCancel={() => this.setState({ selectedValues:[] })} onSave={() => onSave(type,selectedValues)} />
      </div>
    )
  }
}
