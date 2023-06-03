import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import ActionButtons from './lib'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(ActionButtons)

new Vue({
  render: h => h(App),
})
.$mount('#app')
