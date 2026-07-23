import { Chart } from "chart.js/auto";

type DailyRequestStat = {
  date: string;
  total_requests: number;
  total_visits: number;
};

const fetchWeeklyRequests = async (): Promise<DailyRequestStat[]> => {
  const res = await fetch("/api/requests/weekly");
  return res.json();
};

export const renderUptimeBadge = async () => {
  const badge = document.getElementById("uptime-badge");
  if (!badge) return;

  const res = await fetch("/api/stats");
  const stats = await res.json();
  const uptime: number = stats.uptime_percent;

  badge.textContent = `Server Uptime: ${uptime.toFixed(2)}%`;
  badge.classList.remove("bg-red-600", "bg-orange-500", "bg-green-600");
  const color =
    uptime < 50 ? "bg-red-600" : uptime < 100 ? "bg-orange-500" : "bg-green-600";
  badge.classList.add(color);
};

export const renderTrafficChart = async () => {
  const stats = await fetchWeeklyRequests();
  const canvas = document.getElementById("traffic-chart") as HTMLCanvasElement;
  if (!canvas) return;

  const totalRequestsEl = document.getElementById("stat-total-requests");
  const totalVisitsEl = document.getElementById("stat-total-visits");
  if (totalRequestsEl) totalRequestsEl.textContent = stats.reduce((sum, s) => sum + s.total_requests, 0).toLocaleString();
  if (totalVisitsEl) totalVisitsEl.textContent = stats.reduce((sum, s) => sum + s.total_visits, 0).toLocaleString();

  new Chart(canvas, {
    type: "line",
    data: {
      labels: stats.map((s) => s.date),
      datasets: [
        {
          label: "Requests",
          data: stats.map((s) => s.total_requests),
          borderColor: "#6366f1",
          backgroundColor: "#6366f133",
          tension: 0.3,
          fill: true,
        },
        {
          label: "Visits",
          data: stats.map((s) => s.total_visits),
          borderColor: "#f59e0b",
          backgroundColor: "#f59e0b33",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
};
