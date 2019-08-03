import React from 'react'

import PropTypes from 'prop-types'

import { BASE_URL } from "../../utils/index"

import styles from './index.module.scss'

const NoHouse = ({children}) => (
   <div className={styles.root}>
    <img
      className={styles.img}
      src={BASE_URL + 'img/not-found.png'} alt="暂无数据"
    />
    <p className={styles.msg}>{children}</p>
   </div>  
)

NoHouse.propTypes = {
  children:PropTypes.string.isRequired
}

export default NoHouse