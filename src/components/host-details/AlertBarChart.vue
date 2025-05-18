<template>
  <div class="alert-bar-chart">
    <apexchart
      type="bar"
      :height="height"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  alertData: {
    type: Object,
    required: true
  },
  height: {
    type: Number,
    default: 90
  }
});

const series = computed(() => {
  if (!props.alertData || !props.alertData.alert_intervals) {
    return [{ name: 'Alerts', data: [] }];
  }
  return [
    {
      name: 'Alerts',
      data: props.alertData.alert_intervals || []
    }
  ];
});

const chartOptions = ref({
  chart: {
    toolbar: {
      show: false,
    },
    background: 'transparent',
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '80%',
      distributed: false,
      borderRadius: 2,
      colors: {
        ranges: [
          {
            from: 0,
            to: 0,
            color: '#00C853' // Sharp green for zero alerts
          },
          {
            from: 1,
            to: 10,
            color: '#FFD600' // Bright yellow for low alerts (1-10)
          },
          {
            from: 11,
            to: 25,
            color: '#FF9800' // Orange for medium alerts (11-25)
          },
          {
            from: 26,
            to: 100,
            color: '#F44336' // Bright red for high alerts (26-100)
          },
          {
            from: 101,
            to: 999999,
            color: '#B71C1C' // Crimson for very high alerts (100+)
          }
        ]
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    show: false
  },
  xaxis: {
    categories: [],
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    y: {
      formatter: (val: number) => `${val} alerts`
    }
  },
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.15,
      }
    }
  }
});
</script>

<style scoped>
.alert-bar-chart {
  padding: 8px 0;
  width: 100%;
  min-height: 50px;
  margin: 5px 0;
}

:deep(.apexcharts-tooltip) {
  background: #1e1e1e !important;
  border: none !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4) !important;
}

:deep(.apexcharts-tooltip-title) {
  background: #2d2d2d !important;
  border-bottom: 1px solid #3a3a3a !important;
}
</style>
