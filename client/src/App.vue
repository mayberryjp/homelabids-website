<template>
  <div id="app">
    <!-- Stats Banner -->
    <div class="stats-banner">
      <div class="stat-item">
        <h3>Whitelist</h3>
        <p>{{ formatNumber(stats.whitelist) }}</p>
      </div>
      <div class="stat-item">
        <h3>Alerts</h3>
        <p>{{ formatNumber(stats.alerts) }}</p>
      </div>
      <div class="stat-item">
        <h3>Localhosts</h3>
        <p>{{ formatNumber(stats.localhosts) }}</p>
      </div>
      <div class="stat-item">
        <h3>All Flows</h3>
        <p>{{ formatNumber(stats.allflows) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      stats: {
        whitelist: 0,
        alerts: 0,
        localhosts: 0,
        allflows: 0,
      },
    };
  },
  methods: {
    fetchStats() {
      fetch("http://localhost:3000/api/stats")
        .then((res) => res.json())
        .then((data) => {
          this.stats = data;
        });
    },
    formatNumber(number) {
      return number.toLocaleString(); // Formats the number with commas
    },
  },
  mounted() {
    this.fetchStats();
    this.socket = io("http://localhost:3000");
    this.socket.on("statsUpdated", this.fetchStats);
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style>
/* General Styles */
#app {
  font-family: 'Inter', Arial, sans-serif;
  background-color: #1e1e2f; /* Dark background */
  color: #ffffff; /* Light text */
  min-height: 100vh;
  margin: 0;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Stats Banner */
.stats-banner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #2a2a40; /* Slightly lighter dark background */
  padding: 20px;
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  width: 80%; /* Centered and responsive */
  max-width: 1200px;
}

.stat-item {
  text-align: center;
  font-size: 18px;
  flex: 1; /* Equal spacing for all items */
}

.stat-item h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #b1b8c0; /* Stat category text color */
}

.stat-item p {
  margin: 5px 0 0;
  font-size: 28px; /* Larger font for numbers */
  font-weight: bold;
  color: #5cdd8b; /* Stat count color */
}
</style>