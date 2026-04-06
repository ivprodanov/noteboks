import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import useNoteStore from '../store/useNoteStore';

export const GraphView = ({ height = 400 }) => {
  const { bokses, currentBoksId } = useNoteStore();
  
  const activeBoks = bokses.find(b => b.id === currentBoksId);
  const notes = activeBoks ? activeBoks.notes : [];

  const navigate = useNavigate();

  // Format data for the graph
  const data = useMemo(() => {
    if (!notes.length) return { nodes: [], links: [] };
    const nodes = notes.map(note => ({
      id: note.id,
      name: note.title,
      val: note.type === 'permanent' ? 3 : 1.5, // Permanent notes look bigger
      color: note.type === 'permanent' ? '#d97706' : 
             note.type === 'literature' ? '#3b82f6' : '#94a3b8'
    }));

    const links = [];
    notes.forEach(note => {
      if (note.links) {
        note.links.forEach(targetId => {
          // Only add link if the target note actually exists
          if (notes.find(n => n.id === targetId)) {
            links.push({ source: note.id, target: targetId });
          }
        });
      }
    });

    return { nodes, links };
  }, [notes]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing">
      <ForceGraph2D
        graphData={data}
        height={height}
        nodeLabel="name"
        nodeColor={node => node.color}
        nodeRelSize={6}
        linkColor={() => '#e2e8f0'}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={(node) => navigate(`/note/${node.id}`)}
        // Making it look "pleasing"
        cooldownTicks={100}
      />
    </div>
  );
};

export default GraphView;