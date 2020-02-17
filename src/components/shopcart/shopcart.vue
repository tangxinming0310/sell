<template>
  <div>
    <div class='shopcart'>
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0" :class="{'highlight': totalCount > 0}">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
          >
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectedFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control @add="addFood" :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>

import cartControl from 'components/cart-control/cart-control.vue'
import BScroll from 'better-scroll'
const BALL_LEN = 10
function createBalls() {
  let balls = []
  for (let i = 0; i < BALL_LEN; i++) {
    balls.push({ show: false })
  }
  return balls
}
export default {
// import引入的组件需要注入到对象中才能使用
  components: {
    cartControl
  },
  props: {
    selectedFoods: {
      type: Array,
      default: () => ([])
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    // 这里存放数据
    return {
      balls: createBalls(),
      fold: true // 是否折叠
    }
  },
  // 监听属性 类似于data概念
  computed: {
    totalPrice() {
      let total = 0
      this.selectedFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectedFoods.forEach(food => {
        count += food.count
      })
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = (this.minPrice - this.totalPrice)
        if (diff % 1 !== 0) {
          diff = diff.toFixed(2)
        }
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow() {
      if (!this.totalCount) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    addFood(target) {
      this.drop(target)
    },
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    hideList() {
      this.fold = true
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return
      }
      alert(`支付${this.totalPrice} 元`)
      this.hideList()
      this.empty()
    },
    empty() {
      this.selectedFoods.forEach(food => {
        food.count = 0
      })
    },
    drop(el) {
      // 拿到一个小球
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop(el) {
      const ball = this.dropBalls[this.dropBalls.length - 1]
      // 获取最新点击的小球的位置 相对于视口的左上角位置而言
      const rect = ball.el.getBoundingClientRect()
      // 求出购物车中心小球需要移动到当前点击的小球的位置 需要 x 轴移动的距离和 y 轴移动的距离
      // 求小球与购物车中心位置
      const x = rect.left - 32
      // window.innerHeight 屏幕的高度 - 距离顶部的距离里 - 距离底部的距离
      const y = -(window.innerHeight - rect.top - 22)
      // 如果直接移动的话会是一个斜线，所以需要添加贝塞尔曲线 现在是添加的 y 轴方向的
      // 显示小球
      el.style.display = ''
      // y 方向的移动
      el.style.transform = el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
      // x 方向的移动依靠内部的 div 去完成
      const inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
    },
    dropping(el, done) {
      // 触发重绘
      this._reflow = document.body.offsetHeight
      // 回到初始位置
      el.style.transform = el.style.webkitTransform = 'translate3d(0, 0, 0)'
      const inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transform = inner.style.webkitTransform = 'translate3d(0, 0, 0)'
      el.addEventListener('transitionend', done)
    },
    afterDrop(el) {
      // 获取最先的小球
      const ball = this.dropBalls.shift()
      // 如果有的话回收
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.dropBalls = []
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='stylus' scoped>
  @import "~@/common/stylus/mixin.styl";
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #ffffff
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          border-radius 16px
          font-size 9px
          font-weight 700
          color #fff
          background: rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all .3s
      &.fold-enter, &.fold-leave-active
        transform translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
       .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    --webkit-filter blur(10px)
    filter blur(10px)
    opacity 1
    background rbga(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all .5s
    &.fade-enter, &.fade-leave-active
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
