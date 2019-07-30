import React from "react"

import PropTypes from 'prop-types'

import { Flex } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

import styles from  "./index.module.scss"

function SearchHeader({ history,cityName,className }) {
  // console.log(history,cityName)
  return (
     <Flex className={[styles.root, className]}>
            <Flex className={styles.searchLeft}>
              <div className={styles.location}
                onClick={() => history.push('/citylist')}
              >
                <span className="name">{cityName}</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              <div className={styles.searchForm} onClick={() => history.push('/search')}>
                <i className="iconfont icon-seach"></i>
                <span className="text">
                  请输入小区地址
                </span>
              </div>
            </Flex>
            <i className="iconfont icon-map" onClick={() => history.push('/map') }></i>
         </Flex>
  )
}

SearchHeader.propTypes = {
  cityName:PropTypes.string.isRequired
}

SearchHeader.defaultProps = {
  className:''
}

export default withRouter(SearchHeader)