import { useState, useEffect } from 'react';
import DirectorNetwork from '@/components/DirectorNetwork';
import { buildDirectorNetwork, detectPhoenixingRisk } from '@/lib/networkAnalysis';

export default function NetworkAnalysis() {
  const [networkData, setNetworkData] = useState(null);
  const [phoenixingRisks, setPhoenixingRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companiesRes, usersRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/users')
        ]);

        const companies = await companiesRes.json();
        const users = await usersRes.json();

        const network = buildDirectorNetwork(companies, users);
        const risks = detectPhoenixingRisk(network);

        setNetworkData(network);
        setPhoenixingRisks(risks);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading network analysis...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Director Network Analysis</h1>

      {phoenixingRisks.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-900 mb-2">
            ⚠️ Phoenixing Risk Detected
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {phoenixingRisks.length} director(s) are connected to 3+ companies, indicating potential phoenixing patterns.
          </p>
          <div className="space-y-2">
            {phoenixingRisks.map((risk, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium">Director {idx + 1}:</span> Connected to {risk.companyCount} companies
                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                  risk.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {risk.riskLevel} Risk
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {networkData && <DirectorNetwork data={networkData} />}

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About This Analysis</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Phoenixing</strong> is when directors repeatedly create and dissolve companies to avoid paying debts, 
            costing the UK economy an estimated £3 billion annually.
          </p>
          <p>
            Our proprietary algorithm analyzes director connections across 4.8M UK companies to identify suspicious patterns:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Directors connected to multiple dissolved companies</li>
            <li>Rapid company formation and dissolution cycles</li>
            <li>Shared directors across high-risk entities</li>
            <li>Geographic and temporal clustering patterns</li>
          </ul>
          <p className="mt-4">
            <strong>Innovation:</strong> ComplianceOS is the first platform to visualize and predict phoenixing risk 
            through network graph analysis, enabling proactive intervention before fraud occurs.
          </p>
        </div>
      </div>
    </div>
  );
}