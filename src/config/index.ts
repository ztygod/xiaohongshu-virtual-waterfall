import data1 from './data1.json'
import data2 from './data2.json'
import type { ICardItem } from '@/utils/type';

const colorArr = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"]

const list1: ICardItem[] = data1.data.items.map((i) => ({
  id: i.id,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname,
}));

const list2: ICardItem[] = data2.data.items.map((i) => ({
  id: i.id,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname,
}));

const list = [...list1,...list2].map((item,index) => ({bgColor:colorArr[index % (colorArr.length - 1)],...item}))

export default list