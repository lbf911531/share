
import React, { useEffect, useRef, useState } from 'react';
import { pxRatio } from './utils';
import { Cycle, Rectangle, Line } from './shapes';


import './style.less';
import PainterToolbar from './painter-toolbar';

type Shape = Rectangle | Cycle;

interface Action {
  shape: number;
  type: 'DRAGGING' | 'PAINTING' | 'CLICK' | 'INIT' | 'START' | 'END';
  position?: { x: number; y: number };
  target: 'CANVAS' | 'SHAPE';
  startTime: number;
}

export default function Painter({
  width = 600,
  height = 300,
  id = 'painter',
  isAdaptive = true,
  onClick,
}) {

  // 记录当前画布已绘制的图形
  const shapes = useRef<Array<Shape>>([]);

  // 画布操作栏勾选的配置信息（包括绘制图形的颜色，图形类型...）
  const [brush, setBrush] = useState<Record<string, string>>({ shapeType: 'rect', color: '#FFA500' });

  // 画布的原点及大小等信息
  const [scene, setSceneConfig] = useState({ x: 0, y: 0, width, height });

  // 托管绘制时需要的相关参数,以便mousedown,mousemove,mouseup事件访问
  const _action = useRef<Action>({
    shape: -1,      // 操作的对象的在shapes中的索引
    type: 'INIT',     // 当前操作类型（绘制/移动），
    target: 'CANVAS',
    startTime: 0,     // 动作开始时间，用来判断mousedown 到up的间隔，决定是否触发点击事件
  });

  const [toolList] = useState([
    {
      id: 'rect',
      name: "矩形",
    },
    {
      id: 'cycle',
      name: '圆形',
    },
    {
      id: 'line',
      name: '线段',
    }
  ]);

  useEffect(() => {
    const scene = init();
    setSceneConfig(scene);
  }, []);

  useEffect(() => {
    const unbind = registerEventListener();
    return unbind;
  }, [scene]);

  function $getAction(): Action {
    return _action.current;
  }

  function $setAction(val: Action) {
    _action.current = val;
  };

  function initAction(type: 'INIT' | 'END' = 'INIT') {
    $setAction({
      type,
      target: 'CANVAS',
      shape: -1,
      startTime: 0,
    });
  }

  function init() {
    const eCanvas: HTMLCanvasElement | null = document.querySelector(`#${id}`);
    if (eCanvas) {
      const eCanvasWrap = document.querySelector(`#${id}-wrap`);

      const w = isAdaptive ? eCanvasWrap?.clientWidth || width : width;
      const h = isAdaptive ? eCanvasWrap?.clientHeight || height : height;

      eCanvas.width = pxRatio(w);
      eCanvas.height = pxRatio(h);
      eCanvas.style.width = `${w}px`;
      eCanvas.style.height = `${h}px`;

      const cvsRect = eCanvas.getBoundingClientRect();
      return {
        x: cvsRect.left,
        y: cvsRect.top,
        width: eCanvas.width,
        height: eCanvas.height,
      }
    }
    return ({ x: 0, y: 0, width, height });
  };

  function registerEventListener() {
    function remove(evt) {
      if (evt.keyCode === 46) {
        removeShape();
      }
    }
    document.addEventListener('keydown', remove);

    return () => {
      document.removeEventListener('keydown', remove);
    }
  };


  /**
   * @description 配合拖拽逻辑，频繁触发画布重绘
   * @returns 
   */
  function multiRepaint() {
    const _action = $getAction();
    if (!['DRAGGING', 'PAINTING'].includes(_action.type)) return;
    repaint();
    requestAnimationFrame(multiRepaint);
  };

  /**
   * @description 将shapes数组中存放的各类图形绘制到画布上
   * 每次绘制前，重置一层画布
   */
  function repaint() {
    const eCanvas: HTMLCanvasElement | null = document.querySelector(`#${id}`);
    const ctx = eCanvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, scene.width, scene.height);
      shapes.current.forEach(widget => {
        widget.draw(ctx);
      });
    }
  };

  /**
  * @description 获取当前相对canvas画布原点的坐标
  * @param evt 
  * @returns 
  */
  function getRelPosition(evt) {
    return ({
      x: evt.clientX - scene.x,
      y: evt.clientY - scene.y,
    })
  };

  /**
   * @description 根据当前点击的位置，判断所在范围内是否存在已绘制图形，是则返回图形，否则返回null
   * @param pos 当前点击的坐标点
   * @returns 返回查找到的图形或null
   */
  function findShapeIndex(pos: { x: number; y: number }): number {
    for (let i = shapes.current.length - 1; i >= 0; i -= 1) {
      const isIncluded = shapes.current[i].isIncluded(pos.x, pos.y);
      if (isIncluded) {
        return i;
      }
    }
    return -1;
  };

  /**
   * @description 创建图形，设置图形起始坐标，画笔等相关配置
   * @param evt 
   */
  function createShape(pos) {
    const Shape = {
      'cycle': Cycle,
      'rect': Rectangle,
      'line': Line,
    };
    const shape = new Shape[brush.shapeType || 'rect'](
      pos.x,
      pos.y,
      brush.color,
      { enabled: true }
    );

    return shape;
  };


  function removeShape() {
    const action = $getAction();
    if (action.shape >= 0) {
      shapes.current.splice(action.shape, 1);
      repaint();
      initAction('END');
    }
  };

  function paintShape(evt) {
    const action = $getAction();
    const shape = shapes.current[action.shape];
    if (shape) {
      const pos = getRelPosition(evt);
      shape.tick(pos.x, pos.y);
      multiRepaint();
    }
  };

  function moveShape(evt) {
    const action = $getAction();
    const shape = shapes.current[action.shape];
    if (shape) {
      const { position = { x: 0, y: 0, } } = action;
      const offsetX = evt.clientX - position.x;
      const offsetY = evt.clientY - position.y;

      shape.move(offsetX, offsetY);
      /**
       * 偏移量是基于上一次鼠标所在位置计算的，因此每次移动后，需要重设 偏移起点
       */
      $setAction({
        ...action,
        position: {
          x: evt.clientX,
          y: evt.clientY,
        },
      });
      multiRepaint();
    }
  }

  /**
   * @description 
   *  - 鼠标按下事件
   *  - 在这个方法中，初始化动作参数，交给后续移动和抬起事件，来判断此次意图点击还是拖拽
   * @param evt 
   */
  function dispatchMousedown(evt) {
    const pos = getRelPosition(evt);
    const index = findShapeIndex(pos);
    const eventStartTimer = new Date().getTime();

    const action: Action = {
      startTime: eventStartTimer,
      type: 'START',
      target: 'CANVAS',
      shape: -1,
      position: {
        x: evt.clientX,
        y: evt.clientY,
      },
    }

    if (index >= 0) {
      action.target = 'SHAPE';
      action.shape = index;
    }

    $setAction(action);
  }

  /**
   * @description 
   *  - 1. 拖拽方法必须发生在鼠标按下之后（如果是按下抬起形成的点击，是不可能进入这个方法的）
   *  - 2. 拖拽分为了 拖拽绘制 和拖拽移动
   *  - 3. 拖拽一定针对图形，而非画布
   * @param evt 
   * @returns 
   */
  function dispatchMousemove(evt) {
    const action = $getAction();
    if (action.type === 'INIT') return;

    if (action.type === 'START') {
      // 拖拽还是绘制？绘制之前，先创建图形
      action.type = action.target === 'CANVAS' ? 'PAINTING' : 'DRAGGING';
      if (action.target === 'CANVAS') {
        const pos = getRelPosition(evt);
        const shape = createShape(pos);
        shapes.current.push(shape!);
        /**
         * 在上一个钩子中，鼠标按下并不能判断是想触发click函数还是拖拽
         * 但只要进入了当前方法，就表示所要执行的是拖拽，因此再进一步判断拖拽是 拖拽绘制 还是拖拽移动
         * 但不论哪个，操作的都是图形，因此这里将target改为 shape,
         */
        action.target = 'SHAPE';
        action.shape = shapes.current.length - 1;
      }
      $setAction(action);
    }

    if (action.type === 'PAINTING') {
      // 绘制图形
      paintShape(evt);
    } else if (action.type === 'DRAGGING') {
      // 移动图形
      moveShape(evt);
    }
  }

  function dispatchMouseup(evt) {
    const action = $getAction();
    if (!action.target) return;

    const endEventTimer = new Date().getTime();
    const duration = endEventTimer - action.startTime;
    if (duration <= 500 && action.type === 'START') {
      // 触发点击事件
      $setAction({
        ...action,
        type: 'CLICK',
      });
      onEmitClickEvt(evt);
    } else {
      initAction('END');
    }
  }

  function onEmitClickEvt(evt) {
    const action = $getAction();
    if (action.type === 'CLICK') {
      if (onClick) {
        onClick(evt, action.shape, () => {
          initAction('END');
        });
      }
    };
  }

  return (
    <div className='cpt-painter-component'>
      <PainterToolbar list={toolList} onChange={setBrush} value={brush} />
      <div id={`${id}-wrap`} className='cpt-painter-wrap' style={{ height }}>
        <canvas
          id={id}
          onMouseDown={dispatchMousedown}
          onMouseMove={dispatchMousemove}
          onMouseUp={dispatchMouseup}
        />
      </div>
    </div>
  )
}