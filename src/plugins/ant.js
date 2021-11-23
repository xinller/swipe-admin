import Vue from 'vue'
import { Button , ConfigProvider ,Icon ,Layout , Form ,FormModel ,Input ,Card , FormItem} from 'ant-design-vue';

function InjectAntPlugin(){
  Vue.component(Button.name, Button)
  Vue.component(ConfigProvider.name, ConfigProvider)
  Vue.component(Icon.name, Icon)
  Vue.component(Layout.name, Layout)
  Vue.component(Form.name, Form)
  Vue.component(FormModel.name, FormModel)
  Vue.component(Input.name, Input)
  Vue.component(Card.name, Card)
  Vue.component(FormItem.name, FormItem)
}
export default  InjectAntPlugin