import { pxRatio } from "../utils";


export default class Cycle {

  centerX: number;
  centerY: number;
  color: string;
  radius: number;
  stroke: {
    lineWidth: number;
    color: string;
    enabled: boolean;
  };

  constructor(x, y, color, stroke) {
    this.centerX = x;
    this.centerY = y;
    this.color = color;
    this.stroke = stroke;
  }

  /**
   * @description 记录图形路径上所必须的坐标点，对于圆形而言，只需要横坐标计算半径即可
   * @param x 
   * @param y 
   */
  tick(x: number, y: number) {
    this.radius = Math.abs(this.centerX - x);
  };

  /**
   * @description 偏移/移动 图形
   * @param x 
   * @param y 
   */
  move(x: number, y: number) {
    this.centerX += x;
    this.centerY += y;
  }

  /**
   * @description 绘制图形
   * @param ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    const radius = pxRatio(this.radius);
    ctx.fillStyle = this.color;
    ctx.arc(pxRatio(this.centerX), pxRatio(this.centerY), radius, 0, 2 * Math.PI);

    ctx.fill();
    if (this.stroke.enabled) {
      ctx.strokeStyle = this.stroke.color || '#fff';
      ctx.lineWidth = pxRatio(this.stroke.lineWidth || 3);
      ctx.stroke();
    }
  };

  /**
   * @description 判断传入的坐标点是否处于当前图形内
   * @param x 
   * @param y 
   * @returns 
   */
  isIncluded(x: number): boolean {
    const _radius = Math.abs(this.centerX - x);
    return (_radius >= 0 && _radius <= this.radius);
  }
}