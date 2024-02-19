
import { editor } from 'monaco-editor';

const { ContentWidgetPositionPreference } = editor;

export class MonacoDragNDropProvider {
  // 文件中的方法是按 执行顺序排序的
  domNode = null;

  mouseDropWidget = null;

  dragTarget;

  // 拖拽中事件
  onDragOver = (e) => {
    const instance = this.getInstance();
    instance && this.displayMouseDropPosition(instance, instance.getTargetAtClientPoint(e.clientX, e.clientY));
    e.preventDefault();
  };

  /**
   * 显示自定义 鼠标拖拽控件
   * @param {*} instance 编辑器实例
   * @param {*} target 
   */
  displayMouseDropPosition = (instance, target) => {
    // 更新鼠标位置
    this.dragTarget = target;

    // 如果存在鼠标拖拽控件，调用实例中的 layoutContentWidget 更新位置
    // 如果不存在，生成一个新的
    if (this.mouseDropWidget) {
      instance.layoutContentWidget(this.mouseDropWidget);
    } else {
      this.mouseDropWidget = this.buildMouseDropWidget();
      instance.addContentWidget(this.mouseDropWidget);
    }
  };

  // 生成 鼠标推拽控件(即 自定义光标)
  buildMouseDropWidget = () => {
    if (!this.domNode) {
      this.domNode = document.createElement('div');
      this.domNode.className = this.dropClassName;
      this.domNode.style.pointerEvents = 'none';
      this.domNode.style.borderLeft = '2px solid #000';
      this.domNode.innerHTML = '&nbsp;';
    }
    return {
      getId: () => 'drag',
      getDomNode: () => this.domNode,
      getPosition: () => ({
        position: this.dragTarget.position,
        preference: [ContentWidgetPositionPreference.EXACT, ContentWidgetPositionPreference.EXACT],
      }),
    };
  };

  // 拖拽完成后 执行外部传入的onDrop 方法
  onDrop = (e) => {
    this.onDropHandler && this.onDropHandler(e, this.dragTarget, this.getInstance());
    this.removeMouseDownWidget();
  };

  // 移除 鼠标推拽控件
  removeMouseDownWidget = () => {
    const instance = this.getInstance();
    if (instance && this.mouseDropWidget && this.domNode) {
      instance.removeContentWidget(this.mouseDropWidget);
      this.mouseDropWidget = null;
    }
  };

  dropClassName;

  onDropHandler;

  getInstance;

  // 属性
  props = {
    onDragOver: this.onDragOver,
    onDropCapture: this.onDrop,
    onDragLeaveCapture: this.removeMouseDownWidget,
  };

  constructor(onDrop, getInstance, dropClassName = 'drop') {
    this.dropClassName = dropClassName;
    this.onDropHandler = onDrop;
    this.getInstance = getInstance;
  }
}