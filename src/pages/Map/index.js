import React from 'react'

// import axios from 'axios';

import { Toast } from 'antd-mobile'

// 导入 classnames
import classNames from 'classnames'


// 导入 获取当前定位城市 方法
import { getCurrentCity,BASE_URL,API } from '../../utils'

// 导入 NavHeader 组件
import NavHeader from '../../components/NavHeader'

// 导入样式
import './index.css'

import styles from "./index.module.scss"

// import styles from './index.module.css'

const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

// 注意：如果要在脚手架代码中访问全局对象，应该 通过 window 来访问
// https://facebook.github.io/create-react-app/docs/using-global-variables
const BMap = window.BMap

export default class Map extends React.Component {
  state = {
    // 控制房源列表的展示和隐藏
    isShowHouseList: false,
    // 小区里面的房源列表
    houseList:[]
  }
  componentDidMount() {
    this.initMap()
  }

  // 初始化地图
  async initMap() {
    const { label,value } = await getCurrentCity()
    // console.log('当前定位城市名称：', label)

    // 创建百度地图对象
    // 参数：表示地图容器的id值
    // const map = new BMap.Map('container')
    const map = new BMap.Map('container')
    // 为了能够在其他方法中获取到地图对象，添加到 this 中
    this.map = map
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async point => {
        if (point) {
          map.centerAndZoom(point, 11)

          // 添加两个常用控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())

          this.renderOverlays(value);

          // const res = await Axios.get(`http://localhost:8080/area/map`, {
          //   params: {
          //     id:value
          //   }
          // })

          // console.log(res);

          // res.data.body.forEach(item => {
          //   const {
          //     coord:{latitude,longitude}
          //   } = item
          //   const point = new BMap.Point(longitude,latitude);
          //   // console.log(item);
          //   const opts = {
          //     position: point, // 指定文本标注所在的地理位置
          //     offset: new BMap.Size(-35, -35)
          //   }
          //   const label = new BMap.Label("文本信息", opts)
          //   label.setContent(`
          //     <div class="${styles.bubble}">
          //       <p class="${styles.name}">${item.label}</p>
          //       <p>${item.count}套</p>
          //     </div>
          //   `)
          //   label.setStyle(labelStyle)
          //   label.addEventListener('click', () => {
          //     console.log(item);
          //   })
          //   map.addOverlay(label)
          // })
        }
      },
      label
    )
  }

  async renderOverlays(id) {
    Toast.loading('加载中',0,null,false)
    const res = await API.get(`/area/map`, {
      params: {
        id
      }
    })

    Toast.hide()

    const { nextZoom,type } = this.getTypeAndZoom()
    
    
    // console.log('获取到的房源数据：', res, nextZoom, type);
    // nextZoom 下一层级别 type 下一层级别的形状类型
    res.data.body.forEach(item => {
      this.createOverlays(type,nextZoom,item)
    })
  }

  getTypeAndZoom() {
    const curZoom = this.map.getZoom()
    // console.log(curZoom);  // 当前级别
    let nextZoom, type
    if (curZoom >= 10 && curZoom < 12) {
    // 11 是默认缩放级别，此时展示所有区的覆盖物
    type = 'circle'
    nextZoom = 13
    } else if(curZoom >= 12 && curZoom <14) {
      nextZoom = 15
      type='circle'
    } else {
      type='rect'
    }
    return { type, nextZoom }
  }

  createOverlays(type, nextZoom, item) {
    // console.log(item);
    const {
      coord: { latitude, longitude },
      label,
      count,
      value
    } = item
    const point = new BMap.Point(longitude,latitude);

    if (type === 'rect') {
    // 小区
      this.createRect(label,count,value,point)
    } else {
    // 区和镇
     this.createCircle(label,count,point,value,nextZoom)
    }
  }

  createCircle(name,count,point,id,zoom) {
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-35, -35)
    }
    const label = new BMap.Label("", opts)
    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)
    label.setStyle(labelStyle)
    label.addEventListener('click', () => {
      console.log('点击了', id, zoom);
      // 渲染下一级数据
      this.renderOverlays(id)
      // 清楚当前的覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      },0)
      // 放大地图
      this.map.centerAndZoom(point,zoom)
    })
    // 将创建好的覆盖物对象添加到地图中
    this.map.addOverlay(label)
  }

  createRect(name, count, id, point) {
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -24)
    }
    const label = new BMap.Label("", opts)
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)
    label.setStyle(labelStyle)

    label.addEventListener('click', e => {
      console.log(e);

      const { clientX, clientY } = e.changedTouches[0]
      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 330 + 45) / 2 - clientY
      this.map.panBy(x,y)
      this.getCommunityHouses(id)
    })
    // 将创建好的覆盖物对象添加到地图中
    this.map.addOverlay(label)
  }

  async getCommunityHouses(id) {
    Toast.loading('加载中',0,null,false)
    const res = await API.get(`/houses`, {
      params: {
        cityId:id
      }
    })
    // console.log(res);
    Toast.hide();
    this.setState({
      isShowHouseList: true,
      houseList: res.data.body.list
    })
    console.log(this.state);
  }

   renderHouseList() {
    return this.state.houseList.map(item => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`${BASE_URL}${item.houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {item.tags.map((tag, index) => {
              const tagClass = `tag${index > 2 ? '3' : index + 1}` // tag1 or tag2 or tag3
              return (
                <span
                  key={index}
                  className={[styles.tag, styles[tagClass]].join(' ')}
                >
                  {tag}
                </span>
              )
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }


  render() {
    return (
      <div className="map">
        {/* 导航栏 */}
        <NavHeader>地图找房</NavHeader>

        {/* 地图容器： */}
        <div id="container" className="container" />

        {/* 房源列表结构 */}
        {/* 如果要展示列表结构，只需要添加 styles.show 类名即可 */}
        {/* <div
          className={[
            styles.houseList,
            this.state.isShowHouseList ? styles.show : ''
          ].join(' ')}
        > */}
        <div
          className={classNames(styles.houseList, {
            [styles.show]: this.state.isShowHouseList
          })}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>
      </div>
    )
  }
}
