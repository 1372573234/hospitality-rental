import React from 'react'

import PropTypes from 'prop-types'

import { NavBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom'
import styles from  "./index.module.scss"
function NavHeader({ children,history }){
   return (
    <NavBar
      className={styles.navbar}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => history.go(-1)}
     >
     {/* console.log(history); */}
       
    {children}
     </NavBar>
  )
}

NavHeader.propTypes = {
  children:PropTypes.string.isRequired
}

export default withRouter(NavHeader)