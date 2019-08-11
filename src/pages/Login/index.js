import React, { Component } from 'react'

import styles from "./index.module.css"

import { Flex, WingBlank, WhiteSpace,Toast } from 'antd-mobile';

import { Link } from 'react-router-dom'

import { withFormik,Form,Field,ErrorMessage } from 'formik'
import * as Yup from 'yup';

import { API,setToken } from "../../utils/index"

import NavHeader from "../../components/NavHeader/index"

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
  }

  render() {
    return (
      <div className={styles.root}> 
        <NavHeader className={styles.navHeader}>登录</NavHeader>

        <WhiteSpace size="xl" />

        <WingBlank>
          {/* 相当于 form 表单 */}
          <Form>
            <div className={styles.formItem}>
              {/* 相当于 input 控件 */}
              <Field type="text" name="username"
                placeholder="请输入账号" className={styles.input} />
            </div>
            {/* 错误信息 */}
             <ErrorMessage name="username" className={styles.error}  component="div" />


            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field name="password"
                type="password"
                placeholder="请输入密码" className={styles.input} />
            </div>
            <ErrorMessage name="password" className={styles.error} component="div" />
           
           
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  mapPropsToValues: () => ({ username: 'test2',password:"test2" }), // 提供表单项的值

   validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项')
       .matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
     password: Yup.string().required('账号为必填项')
       .matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线'),
     
   }),

  handleSubmit: async (values, { props }) => {
    // console.log(props);
    const { username, password } = values
    const res = await API.post('/user/login', {
      username,
      password
    })

    // console.log(res);

    const { status,description, body } = res.data
    
    if (status === 200) {
      setToken(body.token)
      // console.log(props)
      console.log(props)
       if (props.location.state) {
        
        props.history.replace(props.location.state.from.pathname)
       } else {
          props.history.go(-1)
      }
         
    } else {
      Toast.info(description,2,null,false)
    }
  }, // 提供表单提交事件

  
})(Login)

export default Login


