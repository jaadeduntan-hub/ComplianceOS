import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import Chart from '@/components/Chart';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAlerts: 0,
    monthlyChecks: 0,
    highRiskUsers: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch End Users
        const usersRes = await fetch('/api/users');
        const users = await usersRes.json();

        // Fetch Alerts
        const alertsRes = await fetch('/api/alerts');
        const alerts = await alertsRes.json();

        // Calculate stats
        const totalUsers = users.length;
        const activeAlerts = alerts.filter(a => a.Status === 'New' || a.Status === 'In Progress').length;
        const highRiskUsers = users.filter(u => u['Risk Category'] === 'High' || u['Risk Category'] === 'Critical').length;

        // Get recent alerts (top 5)
        const sortedAlerts = alerts
          .sort((a, b) => new Date(b['Alert Date']) - new Date(a['Alert Date']))
          .slice(0, 5);

        // Calculate risk distribution
        const riskCounts = users.reduce((acc, user) => {
          const risk = user['Risk Category'] || 'Low';
          acc[risk] = (acc[risk] || 0) + 1;
          return acc;
        }, {});

        const riskChartData = Object.keys(riskCounts).map(key => ({
          name: key,
          value: riskCounts[key]
        }));

        setStats({
          totalUsers,
          activeAlerts,
          monthlyChecks: totalUsers * 2, // Mock calculation
          highRiskUsers,
        });
        setRecentAlerts(sortedAlerts);
        setRiskData(riskChartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total End Users"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon="🔔"
          color="yellow"
        />
        <StatCard
          title="This Month's Checks"
          value={stats.monthlyChecks}
          icon="✅"
          color="green"
        />
        <StatCard
          title="High Risk Users"
          value={stats.highRiskUsers}
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Alerts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAlerts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No alerts found
                  </td>
                </tr>
              ) : (
                recentAlerts.map((alert, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert['Alert Date'] || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert['Alert Type'] || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.Severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        alert.Severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        alert.Severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.Severity || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert.Status || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      {riskData.length > 0 && <Chart data={riskData} />}
    </div>
  );
}