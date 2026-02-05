// Analyzes director connections across companies
export function buildDirectorNetwork(companies, endUsers) {
  const nodes = [];
  const links = [];
  const directorMap = new Map();

  // Create nodes for companies
  companies.forEach(company => {
    nodes.push({
      id: company.id,
      name: company['Company Name'],
      type: 'company',
      directors: company['Directors Count'] || 0
    });
  });

  // Create nodes for directors (using End Users as directors)
  endUsers.forEach(user => {
    const directorId = `director-${user.id}`;
    nodes.push({
      id: directorId,
      name: user['Full Name'],
      type: 'director',
      riskScore: user['Risk Score'] || 0
    });

    // Link directors to companies (mock relationship)
    // In production, this would come from Companies House API
    const linkedCompany = companies[Math.floor(Math.random() * Math.min(3, companies.length))];
    if (linkedCompany) {
      links.push({
        source: directorId,
        target: linkedCompany.id,
        relationship: 'director'
      });
    }
  });

  return { nodes, links };
}

export function detectPhoenixingRisk(network) {
  // Simple phoenixing detection algorithm
  // In production: ML model analyzing dissolution patterns
  
  const directorCompanyCounts = new Map();
  
  network.links.forEach(link => {
    if (link.source.includes('director')) {
      const count = directorCompanyCounts.get(link.source) || 0;
      directorCompanyCounts.set(link.source, count + 1);
    }
  });

  // Directors linked to 3+ companies = potential phoenixing risk
  const highRiskDirectors = Array.from(directorCompanyCounts.entries())
    .filter(([_, count]) => count >= 3)
    .map(([id, count]) => ({
      directorId: id,
      companyCount: count,
      riskLevel: count >= 5 ? 'Critical' : 'High'
    }));

  return highRiskDirectors;
}