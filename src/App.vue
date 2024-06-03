<template>
  <div class="app">
    <div class="container" ref="containerRef">
      <VirtualWaterFall
        :request="getData"
        :gap="15"
        :page-size="15"
        :column="column">
        <template #item="{item,imageHeight}">
          <BookCard
            :detail="{
              imageHeight,
              title:item.title,
              author:item.author,
              bgColor:item.bgColor
            }"></BookCard>
        </template>
      </VirtualWaterFall>
    </div>
  </div>
</template>

<script setup lang="ts">
import BookCard from './components/BookCard.vue';
import VirtualWaterFall from './components/VirtualWaterFall.vue';
import type { ICardItem } from './utils/type';
import list from './config/index'
import { onMounted, onUnmounted, ref } from 'vue';

const containerRef = ref<HTMLDivElement | null>(null)
const column = ref(6)
const containerObserver = new ResizeObserver((entries) => {
  changeColumn(entries[0].target.clientWidth)
})

const changeColumn = (width: number) => {
  if (width > 960) {
    column.value = 5;
  } else if (width >= 690 && width < 960) {
    column.value = 4;
  } else if (width >= 500 && width < 690) {
    column.value = 3;
  } else {
    column.value = 2;
  }
}

onMounted(() => {
  containerRef.value && containerObserver.observe(containerRef.value)
})

onUnmounted(() => {
  containerRef.value && containerObserver.unobserve(containerRef.value)
})
const getData = (page:number,pageSize:number) => {
  return new Promise<ICardItem[]>((reslove) => {
    setTimeout(() => {
      reslove(list.slice((page - 1) * pageSize,(page - 1) * pageSize + pageSize))
    },100)
  })
}
</script>

<style scoped lang="scss">
.app{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  .container{
    width: 1400px;
    height: 900px;
    border: 1px solid red
  }
}
</style>