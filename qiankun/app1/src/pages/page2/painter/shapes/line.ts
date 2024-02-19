import { pxRatio } from "../utils";


/**
 * 矩形
 */
export default class Rectangle {

  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  stroke: {
    lineWidth: number;
    color: string;
    enabled: boolean;
  };
  active: boolean;

  constructor(
    x,
    y,
    color,
    stroke = { lineWidth: 3, enabled: true, color: '#000' },
  ) {
    this.color = color;
    this.startX = x;
    this.startY = y;
    this.stroke = stroke;
  }

  get minX() {
    return Math.min(this.startX, this.endX);
  }

  get minY() {
    return Math.min(this.startY, this.endY);
  }

  get maxX() {
    return Math.max(this.startX, this.endX);
  }

  get maxY() {
    return Math.max(this.startY, this.endY);
  }

  /**
   * @description 记录图形路径上所必须的坐标点，对于矩形而言，是与起始点斜对角的终止点
   * @param endX 
   * @param endY 
   */
  tick(endX: number, endY: number) {
    this.endX = endX || this.endX;
    this.endY = endY || this.endY;
  };

  /**
   * @description 偏移/移动 图形
   * @param x 
   * @param y 
   */
  move(x: number, y: number) {
    this.startX += x;
    this.startY += y;
    this.endX += x;
    this.endY += y;
  }

  /**
   * @description 绘制图形
   * @param ctx 
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    ctx.moveTo(pxRatio(this.startX), pxRatio(this.startY));
    ctx.lineTo(pxRatio(this.endX), pxRatio(this.endY));

    ctx.strokeStyle = this.color;
    ctx.lineWidth = pxRatio(this.stroke.lineWidth || 3);
    ctx.stroke();
  };

  /**
   * @description 判断传入的坐标点是否处于当前图形内
   * @param x 
   * @param y 
   * @returns 
   */
  isIncluded(x: number, y: number): boolean {
    if (
      x <= this.maxX &&
      x >= this.minX &&
      y <= this.maxY &&
      y >= this.minY
    ) {
      const eq1 = (x - this.startX) * (this.endY - this.startY);
      const eq2 = (this.endX - this.startX) * (y - this.startY);
      console.log('flag', eq1 , eq2)
      return (Math.abs(eq1 - eq2) <= 0.5);
    }
    return false;
  };

}