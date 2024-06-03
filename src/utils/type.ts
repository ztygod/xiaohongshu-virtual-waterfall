import type { CSSProperties } from "vue";

export interface IVirtualWaterFallProps{
    gap:number,//卡片间隔
    column:number,//列数
    pageSize:number,//单次请求的数据量
    request : (page:number,pageSize:number) => Promise<ICardItem[]>
}

export interface ICardItem {
  id: number | string;
  width: number;
  height: number;
  [key: string]: any;
}

export interface IColumnQueue{
    list: IRenderItem[],
    height:number
}

export interface IRenderItem {
  item: ICardItem; // 数据源
  y: number; // 卡片距离列表顶部的距离
  h: number; // 卡片自身高度
  style: CSSProperties; // 用于渲染视图上的样式（宽、高、偏移量）
}
export interface IItemRect{
  width:number,
  height:number
}

export interface IBookColumnQueue {
  list: IBookRenderItem[];
  height: number;
}

export interface IBookRenderItem {
  item: ICardItem;
  y: number;
  h: number;
  imageHeight: number;
  style: CSSProperties;
}

export interface IBookItemRect {
  width: number;
  height: number;
  imageHeight: number;
}