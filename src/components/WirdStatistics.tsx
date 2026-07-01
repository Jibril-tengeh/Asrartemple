import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart3 } from 'lucide-react';

interface StatData {
  tool: string;
  timeSpent: number; // in minutes
}

const mockData: StatData[] = [
  { tool: 'Tasbih', timeSpent: 45 },
  { tool: 'Roqya', timeSpent: 30 },
  { tool: 'Quran', timeSpent: 60 },
  { tool: 'Zairja', timeSpent: 15 },
  { tool: 'Asma', timeSpent: 25 },
];

export const WirdStatistics: React.FC = () => {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove();

    const width = wrapperRef.current.clientWidth;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(mockData.map(d => d.tool))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(mockData, d => d.timeSpent) || 100])
      .nice()
      .range([innerHeight, 0]);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .attr('font-size', '12px')
      .attr('color', '#6b7280')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove());

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('font-size', '12px')
      .attr('color', '#6b7280')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .clone()
        .attr('x2', innerWidth)
        .attr('stroke-opacity', 0.1)
      );

    // Bars
    g.selectAll('.bar')
      .data(mockData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.tool) || 0)
      .attr('y', d => y(d.timeSpent))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.timeSpent))
      .attr('fill', '#10b981')
      .attr('rx', 4);

    // Labels
    g.selectAll('.label')
      .data(mockData)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.tool) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.timeSpent) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#10b981')
      .text(d => `${d.timeSpent}m`);

  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-emerald-500" size={20} />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('dashboard.statistics.title', 'Statistiques de pratique (min)')}
        </h2>
      </div>
      <div ref={wrapperRef} className="w-full overflow-x-auto hide-scrollbar">
        <svg ref={svgRef} className="w-full min-w-[300px]" />
      </div>
    </div>
  );
};
