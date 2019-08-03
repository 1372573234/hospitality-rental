import React, { Component, createRef } from 'react'

import styles from "./index.module.scss"

class Sticky extends Component {
  placeholderRef = createRef()
  contentRef = createRef()

  handleScroll = () => {
    const { height } = this.props

    const placeholderEl = this.placeholderRef.current
    const contentEl =this.contentRef.current
    const { top } = placeholderEl.getBoundingClientRect()
    // console.log(top)
    if (top < 0) {
      placeholderEl.style.height = `${height}px`
      contentEl.classList.add(styles.fixed)
    } else {
      placeholderEl.style.height = "0"
      contentEl.classList.remove(styles.fixed)
    }
  }

  componentDidMount() {
    window.addEventListener('scroll',this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll',this.handleScroll)
  }

  render() {
    return (
      <div>
        <div ref={this.placeholderRef}></div>
        <div ref={this.contentRef}>{this.props.children}</div>
     </div>
   )
 }
}

export default Sticky