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
  alerts: number;
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
    // Place alerts first so they appear in the background
    {
      name: "Total Alerts",
      type: 'bar',
      data: sortedData.map((stat) => stat.alerts),
      yAxisIndex: 2  // Use the third y-axis (index 2)
    },
    {
      name: "Total Bytes",
      type: 'line',
      data: sortedData.map((stat) => stat.total_bytes),
      yAxisIndex: 0  // Use the first y-axis (index 0)
    },
    {
      name: "Total Packets", 
      type: 'line',
      data: sortedData.map((stat) => stat.total_packets),
      yAxisIndex: 1  // Use the second y-axis (index 1)
    }
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
    type: 'line', // Default type
    stacked: false,
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
  colors: ["#B71C1C", "#5CDD8B", "#3498db"], // Match the new series order
  fill: {
    opacity: [0.3, 1, 1], // Make the first series (bars) transparent
  },
  stroke: {
    curve: "smooth",
    width: [0, 3, 3], // No stroke for bars, 3px for lines
  },
  plotOptions: {
    bar: {
      columnWidth: '70%',
      borderRadius: 2,
    }
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
    y: {
      formatter: function (
        value: number,
        { seriesIndex }: { seriesIndex: number }
      ) {
        // Format based on series type
        if (seriesIndex === 0) {
          // Total Alerts (first series)
          return Math.round(value).toString();
        } else if (seriesIndex === 1) {
          // Total Bytes (second series)
          return formatBytes(value);
        } else {
          // Total Packets (third series)
          return Math.round(value).toLocaleString();
        }
      }
    },
    shared: true,
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
          colors: "#5CDD8B",
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
    {
      opposite: true,
      title: {
        text: "Alerts",
        style: {
          color: "#B71C1C",
        },
      },
      labels: {
        style: {
          colors: "#B71C1C",
        },
        formatter: function (val: number) {
          return Math.round(val).toString();
        },
      },
      min: 0,
      
      forceNiceScale: true,
      floating: false,
      seriesName: "Alerts"
    }
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
  // Handle edge cases
  if (bytes === undefined || bytes === null || isNaN(bytes)) {
    return "0 B";
  }
  
  if (bytes === 0) return "0 B";
  
  // Handle very small positive values
  if (bytes > 0 && bytes < 1024) {
    return bytes.toFixed(2) + " B";
  }

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  
  // Calculate unit index
  let i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  // Ensure index is within bounds
  i = Math.max(0, Math.min(i, sizes.length - 1));

  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<style scoped>
.chart-wrapper {
  margin-top: 16px;
}
</style>
