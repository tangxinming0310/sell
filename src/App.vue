<template>
  <div class="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item" v-for="(title, idx) in tabTitles" :key="idx">
        <router-link :to="title.path">{{title.name}}</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getSeller } from 'api'
import { urlParse } from 'common/js/util'
import VHeader from 'components/v-header/v-header.vue'
export default {
  components: {
    VHeader
  },
  data() {
    return {
      tabTitles: [
        {
          name: '商品',
          path: '/goods'
        },
        {
          name: '评论',
          path: '/ratings'
        },
        {
          name: '商家',
          path: '/seller'
        }
      ],
      seller: {
        id: (() => {
          const urlParam = urlParse()
          return urlParam.id
        })()
      }
    }
  },
  created () {
    getSeller().then(seller => {
      this.seller = { id: this.seller.id, ...seller }
    })
  }
}
</script>

<style lang="stylus">
  @import './common/stylus/mixin.styl';

  .app
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      // border-bottom 1px solid rgba(7, 17, 27, 0.1)
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex 1
        text-align center
        & > a
          display block
          text-decoration none
          font-size 14px
          color rgb(77, 85, 93)
          &.active
            color rgb(240, 20, 20)
</style>
