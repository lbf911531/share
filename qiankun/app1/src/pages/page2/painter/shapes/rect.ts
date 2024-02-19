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
    stroke,
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

    ctx.moveTo(pxRatio(this.minX), pxRatio(this.minY));
    ctx.lineTo(pxRatio(this.minX), pxRatio(this.maxY));
    ctx.lineTo(pxRatio(this.maxX), pxRatio(this.maxY));
    ctx.lineTo(pxRatio(this.maxX), pxRatio(this.minY));
    ctx.lineTo(pxRatio(this.minX), pxRatio(this.minY));

    ctx.fillStyle = this.color;
    ctx.fill();

    if (this.stroke.enabled) {
      ctx.strokeStyle = this.stroke.color || '#fff';
      ctx.lineCap = 'square';
      ctx.lineWidth = pxRatio(this.stroke.lineWidth || 3);
      ctx.stroke();
    }

    if (this.active) {
      const centerX = pxRatio((this.maxX - this.minX) / 2 + this.minX);
      ctx.arc(
        centerX,
        pxRatio(this.minY),
        4,
        0,
        2 * Math.PI
      );
      ctx.arc(
        centerX,
        pxRatio(this.maxY),
        4,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
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
      return true;
    }
    return false;
  };

  // select() {
  //   this.active = true;
  // }
}