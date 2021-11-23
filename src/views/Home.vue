<template>
  <fragment>
      <c-header/>
      <c-input/>
      <c-chart/>
  </fragment>
</template>

<script>
import CHeader from '@/components/Header.vue';
import CInput from '@/components/Input.vue';
import CChart from '@/components/Chart.vue'

export default {
    name: 'Splash',
    components: {
        CHeader,
        CInput,
        CChart
    }
}
</script>

<style>

</style>