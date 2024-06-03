# virtual-waterfall-demo
# 不定高

这里指的不定高说的是类似小红书的图片加文字形式<br />![屏幕截图 2024-06-02 220724.png](https://cdn.nlark.com/yuque/0/2024/png/40660095/1717337241245-111c99a4-927d-4235-a9a7-77c4a92e8abc.png#averageHue=%239f9d7a&clientId=u7a9ae4e8-058e-4&from=ui&id=u88c9633e&originHeight=1415&originWidth=2053&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=3222941&status=done&style=none&taskId=u8814e54f-6358-435e-a7f1-21a0ff82af6&title=)<br />在之前的关于不定高实现中，我们是先假设一个虚拟高度，先把卡片挂载上，再调用nextTick，在渲染之前得到真实高度，更新卡片宽高和x，y坐标，最后渲染上页面得到不定高卡片。<br />但是在这个情景中，关于定高的逻辑处理我们相对完善，如果我们要插入一个真实DOM高度，我们就需要大改之前的代码，这是我们不愿看到的。所以这里使用了一个不太寻常的办法。**用一个盒子临时存放添加的卡片，等它挂载获取到真实高度后再把它卸载。**
<a name="E4tZI"></a>

## 类型接口

老一套，我们先来看看我们的类型接口。

```typescript
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
```

这些基本与前面一致，要注意的是IBookRenderItem，IBookItemRect相较之前多了一个imageHeight属性，这是我们用来专门记录卡片中图片高度的（因为有文本行的存在，卡片高度不等于图片高度 ）
<a name="EnKO4"></a>

## 计算不定高度

在定高中，我们是利用addInQueue还有其中的generatorItem计算出每个图片的宽高和坐标。在不定高中我们不能这么做。<br />我们首先要得到itemSizeInfo 的信息，包括卡片的宽高和图片的高度。

```typescript
const itemSizeInfo = ref(new Map<ICardItem["id"], IBookItemRect>());

const setItemSize = () => {
  itemSizeInfo.value = dataState.list.reduce<Map<ICardItem["id"], IBookItemRect>>((pre, current) => {
    const itemWidth = Math.floor((scrollState.viewWidth - (props.column - 1) * props.gap) / props.column);
    pre.set(current.id, {
      width: itemWidth,
      height: 0,
      imageHeight: Math.floor((itemWidth * current.height) / current.width),
    });
    return pre;
  }, new Map());
};

```

之后就来实现 mountTemporaryList，在这里挂载临时的卡片，并获取其真实高度：

```typescript
const mountTemporaryList = (list: ICardItem[]) => {
    isShow.value = false
    list.forEach((item) => {
        const rect = itemSizeInfo.value.get(item.id)!
        temporaryList.value.push({
            item,
            y:0,
            h:0,
            imageHeight:rect.imageHeight,
            style:{
                width:`${rect.width}px`
            }
        })
    })
    nextTick(() => {
        const list = document.querySelector("#temporary-list")!;
        [...list.children].forEach((item,index) => {
            const rect = item.getBoundingClientRect()
            temporaryList.value[index].h = rect.height
        })
        isShow.value = true
        updateItemSize()
        addInQueue(temporaryList.value.length)
        temporaryList.value = []
    })
}

```

```typescript
const updateItemSize = () => {
  temporaryList.value.forEach(({ item, h }) => {
    const rect = itemSizeInfo.value.get(item.id)!;
    itemSizeInfo.value.set(item.id, { ...rect, height: h });
  });
};

```

这里的逻辑很简单，就是先得到itemSizeInfo的信息，再将其添加进temporaryList中， temporaryList是临时渲染的数据，在它渲染之前我们得到它的真实高度，并重新更新。最后利用addInQueue计算出样式，截取可视区域的数据项完成虚拟列表。
