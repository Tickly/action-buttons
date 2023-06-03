# action-buttons

基于`ant-design-vue@1`的封装，用于表格行的操作按钮渲染。

## 效果图

### 默认效果

![](/preview/1.png)

### 最多展示 3 个按钮，其余的自动放到【更多】下拉菜单里面

> 这里 3 个按钮的概念，是包含【更多】在内的。

![](/preview/2.png)

## 再看写法

> 模板渲染就不写了，跟原来都一样。

```ts
export default Vue.extend({
  data() {
    return {
      dataSource: [
        { id: 1, username: '张三', disabled: 1 },
        { id: 2, username: '李四', disabled: 0 },
        { id: 3, username: '王二麻子', disabled: 0 },
      ] as MyData[],
      columns: [
        //
        { title: '#', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'username' },
        {
          title: '状态',
          dataIndex: 'disabled',
          customRender: (value: number) => {
            return value === 0 ? (
              <a-tag color="green">启用</a-tag>
            ) : (
              <a-tag>禁用</a-tag>
            );
          },
        },
        useActionButtons<MyData>({
          align: 'center',
          title: '操作',
          limit: 0,
          showDivider: false,
          buttons: [
            { icon: 'search', text: '查看' },
            { icon: 'edit', text: '编辑' },
            {
              text: '禁用',
              visible: (record) => record.disabled === 0,
            },
            {
              text: '启用',
              visible: (record) => record.disabled === 1,
            },
            {
              icon: 'message',
              text(record, index) {
                return `未读消息（${record.id.toString()}）`;
              },
            },
            {
              icon: 'delete',
              text: '删除',
              disabled: (record) => record.disabled === 0,
              click: (record, index) => {
                this.$confirm({
                  content: `确认删除${record.username}吗？`,
                });
              },
            },
          ],
        }),
      ],
    };
  },
});
```

## 介绍用法

```ts
type useActionButtons = (config: ActionButtonsConfig) => Table.Column;
```

原理就是通过一个函数，返回了一个带`customRender`的列的配置。

### 参数介绍

#### 函数声明

```ts
export declare interface ActionButtonsConfig<T> extends Table.Column {
  limit: number;
  showDivider: boolean;
  buttons: Array<ActionButtonsColumnConfig<T>>;
}
```

| 参数        | 类型           | 描述                                                                         |
| ----------- | -------------- | ---------------------------------------------------------------------------- |
| limit       | number         | 设置一个数量，超过该数量，则展示【更多】下拉按钮。默认 0，表示按钮将全部展示 |
| showDivider | boolean        | 是否展示分隔符，默认展示                                                     |
| buttons     | ButtonConfig[] | 要展示的按钮数组,具体配置看下面介绍                                          |

#### ButtonConfig

| 参数      | 类型                                | 描述                                                   |
| --------- | ----------------------------------- | ------------------------------------------------------ |
| text?     | string \| (record, index) => string | 设置按钮文本，同时支持动态设置，参数为当前行的相关数据 |
| icon?     | string                              | 设置按钮图标                                           |
| click     | (record, index) => void             | 设置按钮点击事件，参数为当前行的相关数据               |
| disabled? | (record, index) => boolean          | 动态设置按钮是否禁用，参数为当前行的相关数据           |
| visible?  | (record, index) => boolean          | 动态设置按钮是否显示，参数为当前行的相关数据           |

## 安装

```bash
npm i action-buttons
```

## 使用

> 目前没有写任何样式文件，样式有问题的话，需要自行在项目处理。  
> 按钮的根节点设置了一个 class="action-buttons"

直接在页面引入

```js
import { useActionButtons } from 'action-buttons';
```

然后写到 Table Columns 数组里面对应位置即可。

## 感谢

感谢阅读，欢迎交流。
