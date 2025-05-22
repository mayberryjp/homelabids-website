<template>
  <div class="chart-wrapper">
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface TrafficStat {
  ip_address: string;
  timestamp: string;
  total_packets: number;
  total_bytes: number;
}

const props = defineProps<{
  trafficStats: TrafficStat[] | null;
}>();

const formatTimestamp = (timestamp: string) => {
  // Converting timestamp format from "2025-05-10:02" to a more readable format
  const [datePart, hourPart] = timestamp.split(":");
  const date = new Date(datePart);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()} ${hourPart}:00`;
  return formattedDate;
};

// Computed property to prepare data for the chart
const series = computed(() => {
  if (!props.trafficStats || props.trafficStats.length === 0) {
    return [];
  }

  // Sort by timestamp (most recent last, so it appears on the right of the chart)
  const sortedData = [...props.trafficStats].reverse();

  return [
    {
      name: "Total Bytes",
      data: sortedData.map((stat) => stat.total_bytes),
    },
    {
      name: "Total Packets",
      data: sortedData.map((stat) => stat.total_packets),
    },
  ];
});

// Computed property to prepare chart categories (timestamps)
const categories = computed(() => {
  if (!props.trafficStats || props.trafficStats.length === 0) {
    return [];
  }

  // Sort by timestamp (most recent last)
  const sortedData = [...props.trafficStats].reverse();
  return sortedData.map((stat) => formatTimestamp(stat.timestamp));
});

// Chart options
const chartOptions = computed(() => ({
  chart: {
    id: "traffic-stats-chart",
    background: "#0d1117",
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
    },
  },
  colors: ["#5CDD8B", "#3498db"],
  stroke: {
    curve: "smooth",
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: "dark",
    x: {
      show: true,
      formatter: function (val: string) {
        return val;
      },
    },
  },
  grid: {
    borderColor: "#333",
    row: {
      colors: ["transparent", "transparent"],
      opacity: 0.1,
    },
  },
  xaxis: {
    categories: categories.value,
    labels: {
      style: {
        colors: "#b1b8c0",
      },
    },
    axisBorder: {
      color: "#333",
    },
    axisTicks: {
      color: "#333",
    },
  },
  yaxis: [
    {
      title: {
        text: "Total Bytes",
        style: {
          color: "#5CDD8B",
        },
      },
      labels: {
        style: {
          colors: "#b1b8c0",
        },
        formatter: function (val: number) {
          return formatBytes(val);
        },
      },
    },
    {
      opposite: true,
      title: {
        text: "Total Packets",
        style: {
          color: "#3498db",
        },
      },
      labels: {
        style: {
          colors: "#b1b8c0",
        },
        formatter: function (val: number) {
          return Math.round(val).toLocaleString();
        },
      },
    },
  ],
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "right",
    labels: {
      colors: "#b1b8c0",
    },
  },
}));

// Format bytes to a human-readable format
const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<style scoped>
.chart-wrapper {
  margin-top: 16px;
}
</style>
