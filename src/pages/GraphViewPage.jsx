import GraphView from '../components/GraphView';

const GraphViewPage = () => {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <header className="mb-6">
        <h2 className="text-3xl font-serif font-bold text-slate-800">Knowledge Map</h2>
        <p className="text-slate-500 italic text-sm">Every dot is a thought. Every line is a connection.</p>
      </header>
      
      <div className="flex-1 min-h-0 border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden bg-white">
        {/* We pass a larger height here since it's the main focus */}
        <GraphView height={700} /> 
      </div>
    </div>
  );
};

export default GraphViewPage;