import ActionButtons, { ButtonConfig } from './components/ActionButtons';
import { VueConstructor, h } from 'vue';

type Column = Record<string, any>;

interface ActionButtonsColumnConfig<T> {
  icon?: string;
  text?: string | ((record: T, index: number) => string);
  visible?: (record: T, index: number) => boolean;
  click?: (record: T, index: number) => void;
  disabled?: (record: T, index: number) => boolean;
}

export declare interface ActionButtonsConfig<T> extends Column {
  /**
   * 设置一个数量，超过该数量，则展示【更多】下拉按钮。
   * 默认 0，表示按钮将全部展示
   */
  limit?: number;
  /**
   * 是否展示分隔符，默认展示
   */
  showDivider?: boolean;
  /**
   * 要展示的按钮数组
   */
  buttons: Array<ActionButtonsColumnConfig<T>>;
}

export const useActionButtons = <T>(
  // vm: InstanceType<VueConstructor>,
  config: ActionButtonsConfig<T>
): Column => {
  const { buttons, limit, showDivider, ...column } = config;
  return {
    ...column,
    customRender(text: any, record: any, index: number) {
      return h(ActionButtons, {
        props: {
          limit,
          showDivider,
          buttons: buttons.map((btn) => {
            return Object.assign({}, btn, {
              text: () => {
                if (btn.text instanceof Function)
                  return btn.text(record, index);
                return btn.text;
              },
              visible: () => {
                if (btn.visible) return btn.visible(record, index);
                return true;
              },
              click: () => {
                if (btn.click) btn.click(record, index);
              },
              disabled: () => {
                if (btn.disabled) return btn.disabled(record, index);
                return false;
              },
            });
          }),
        },
      });
    },
  } as Column;
};

export default {
  install(Vue: VueConstructor): void {
    Vue.component('ActionButtons', ActionButtons);
  },
};
