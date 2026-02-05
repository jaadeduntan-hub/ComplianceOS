import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function DirectorNetwork({ data }) {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!data || !data.nodes.length) return;

    const width = 800;
    const height = 600;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.type === 'company' ? 12 : 8)
      .attr('fill', d => {
        if (d.type === 'company') return '#2563EB';
        if (d.riskScore > 70) return '#EF4444';
        if (d.riskScore > 40) return '#F59E0B';
        return '#10B981';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('click', (event, d) => setSelectedNode(d))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Labels
    const label = svg.append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('font-size', 10)
      .attr('dx', 15)
      .attr('dy', 4);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Director Network Analysis</h3>
        <p className="text-sm text-gray-500 mt-1">
          Visualizing director connections across companies to detect phoenixing patterns
        </p>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Legend:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
            <span>Company</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Low Risk Director</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Medium Risk Director</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>High Risk Director</span>
          </div>
        </div>
      </div>

      <svg ref={svgRef} className="border border-gray-200 rounded"></svg>

      {selectedNode && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Selected: {selectedNode.name}</h4>
          <p className="text-sm text-gray-600">
            Type: {selectedNode.type === 'company' ? 'Company' : 'Director'}
          </p>
          {selectedNode.type === 'director' && (
            <p className="text-sm text-gray-600">Risk Score: {selectedNode.riskScore}</p>
          )}
          {selectedNode.type === 'company' && (
            <p className="text-sm text-gray-600">Directors: {selectedNode.directors}</p>
          )}
        </div>
      )}
    </div>
  );
}