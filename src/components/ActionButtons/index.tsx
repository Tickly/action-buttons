import Vue, { CreateElement, PropType, VNode } from 'vue';

export interface ButtonConfig {
  /**
   * 设置按钮类型，参考Button的type
   * 默认为 'link'
   */
  type?: string;
  /**
   * 按钮文本，支持动态获取
   */
  text: string | (() => string);
  /**
   * 按钮图标
   */
  icon?: string;
  /**
   * 按钮是否可见
   */
  visible?: () => boolean;
  /**
   * 按钮点击事件
   */
  click?: () => void;
  /**
   * 按钮是否禁用
   */
  disabled?: () => boolean;
}

export default Vue.extend({
  name: 'ActionButtons',
  props: {
    /**
     * 按钮配置
     */
    buttons: Array as PropType<ButtonConfig[]>,
    /**
     * 显示分隔符
     */
    showDivider: {
      type: Boolean,
      default: true,
    },
    /**
     * 个数限制
     */
    limit: {
      type: Number,
      default: 0,
    },
    /**
     * 尺寸
     */
    size: {
      type: String,
      default: 'small',
    },
  },

  computed: {
    visibleButtons(): Array<ButtonConfig> {
      return this.buttons.filter((button) => {
        return button.visible ? button.visible() : true;
      });
    },
  },
  methods: {
    getRenders(h: CreateElement) {
      let renders: VNode[] = [];
      const unflod: ButtonConfig[] = [];
      const flod: ButtonConfig[] = [];

      this.visibleButtons.forEach((button, index) => {
        if (this.limit === 0 || index < this.limit - 1) {
          unflod.push(button);
        } else flod.push(button);
      });

      if (flod.length === 1) {
        unflod.push(flod.pop()!);
      }

      for (const button of unflod) {
        renders.push(this.renderButton(h, button));
      }
      if (flod.length) {
        renders.push(this.renderMore(h, flod));
      }

      // 分割线
      if (this.showDivider) {
        renders = renders.reduce((list, render, index) => {
          if (index > 0) {
            list.push(this.renderDivider(h));
          }

          list.push(render);

          return list;
        }, [] as VNode[]);
      }

      return renders;
    },
    renderButton(h: CreateElement, button: ButtonConfig): VNode {
      return h(
        'a-button',
        {
          props: {
            type: button.type || 'link',
            size: this.size,
            icon: button.icon,
            disabled: button.disabled ? button.disabled() : false,
          },
          on: {
            click: () => {
              this.triggerClick(button);
            },
          },
        },
        this.getText(button)
      );
    },
    renderDivider(h: CreateElement) {
      return h('a-divider', {
        props: {
          type: 'vertical',
        },
      });
    },
    renderMore(h: CreateElement, foldButtons: ButtonConfig[]) {
      return (
        <a-dropdown>
          {h(
            'a-button',
            {
              props: {
                type: 'link',
                size: this.size,
              },
            },
            ['更多', <a-icon type="down" />]
          )}

          <a-menu slot="overlay">
            {foldButtons.map((button) => this.renderMoreButton(h, button))}
          </a-menu>
        </a-dropdown>
      );
    },
    renderMoreButton(h: CreateElement, button: ButtonConfig) {
      return h(
        'a-menu-item',
        {
          props: {
            icon: button.icon,
            disabled: button.disabled ? button.disabled() : false,
          },
          on: {
            click: () => {
              this.triggerClick(button);
            },
          },
        },
        [
          button.icon
            ? h('a-icon', {
                props: {
                  type: button.icon,
                },
              })
            : null,
          h('span', this.getText(button)),
        ]
      );
    },
    getText(button: ButtonConfig) {
      if (button.text instanceof Function) return button.text();
      return button.text;
    },
    triggerClick(button: ButtonConfig) {
      if (button.click) {
        button.click();
      }
    },
  },
  render(h): VNode {
    return h('div', { class: 'action-buttons' }, [this.getRenders(h)]);
  },
});
