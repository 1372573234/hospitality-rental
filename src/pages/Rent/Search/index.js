import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import _ from 'lodash'

import { getCity, API } from '../../../utils'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  
  timerId = null
  

  search = _.debounce(async val => {
     const res = await API.get(`/area/community`, {
        params: {
          name:val,
          id:this.cityId
        }
      })

      // console.log(res);

      const { body } = res.data
      this.setState({
        tipsList: body.map(item =>( {
          community: item.community,
          communityName:item.communityName
        }))
      })
    },500)
 

  
  handleSearch = async val => {
    // console.log(val)
    if (val.trim() === '') {
      return this.setState({
        searchTxt: "",
        tipsList:[]
      })
    }

    this.setState({
      searchTxt:val
    })
    
    this.search(val)
     

    
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={this.handleClick.bind(this, item)}>
        {item.communityName}
      </li>
    ))
  }


  handleClick = ({community,communityName}) => {
    this.props.history.replace('/rent/add', {
      community,
      communityName
    })
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={this.handleSearch}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
