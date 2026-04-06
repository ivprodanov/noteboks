import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

const MarkdownRenderer = ({ content }) => {
  const navigate = useNavigate();

  // This function finds [[ID]] and turns it into a clickable span
  const renderContentWithLinks = (text) => {
    const parts = text.split(/(\[\[\d+\]\])/g); // Splits by [[12345...]]
    
    return parts.map((part, index) => {
      if (part.match(/\[\[\d+\]\]/)) {
        const id = part.replace(/[\[\]]/g, '');
        return (
          <button
            key={index}
            onClick={() => navigate(`/note/${id}`)}
            className="text-amber-600 hover:text-amber-700 font-mono font-bold decoration-dotted underline underline-offset-4 px-1 rounded hover:bg-amber-50 transition-colors"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className="prose prose-slate prose-amber max-w-none 
                    prose-headings:font-serif prose-headings:font-bold 
                    prose-p:leading-relaxed">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // We override the default paragraph to check for WikiLinks
          p: ({ children }) => {
            if (typeof children === 'string') {
              return <p>{renderContentWithLinks(children)}</p>;
            }
            // If children is an array (mix of text and other tags)
            const processed = React.Children.map(children, child => {
              return typeof child === 'string' ? renderContentWithLinks(child) : child;
            });
            return <p>{processed}</p>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;