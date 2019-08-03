import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

const HouseItem = ({ houseImg,title,desc,tags,price,onclick,style }) => {
  return (
      <div className={styles.house} onClick = {onclick} style={style} >
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`${houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.desc}>{desc}</div>
          <div>
            {tags.map((tag, index) => {
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
            <span className={styles.priceNum}>{price}</span> 元/月
          </div>
        </div>
      </div>
  )
}

HouseItem.popTypes = {
  houseImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  price: PropTypes.oneOfType(
    [PropTypes.string,PropTypes.number]
  ).isRequired,
  onclick:PropTypes.func.isRequired,
  style:PropTypes.object
}

export default HouseItem