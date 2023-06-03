<template>
  <div id="app">
    <a-table row-key="id" :dataSource="dataSource" :columns="columns" />
  </div>
</template>

<script lang="tsx">
import Vue from 'vue';
import { useActionButtons } from './lib';

interface MyData {
  id: number;
  username: string;
  /**
   * 1-被禁用
   * 0-正常
   */
  disabled: number;
}

export default Vue.extend({
  name: 'App',
  components: {},
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
          limit: 3,
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
</script>

<style lang="less">
#app {
  width: 800px;
}
</style>
