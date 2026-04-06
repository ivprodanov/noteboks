import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

const MarkdownRenderer = ({ content, isPreview = false }) => {
  const navigate = useNavigate();

  // Helper to turn strings with [[ID]] into clickable elements
  const formatWikiLinks = (children) => {
    return React.Children.map(children, (child) => {
      if (typeof child !== 'string') return child;

      const parts = child.split(/(\[\[\d+\]\])/g);
      return parts.map((part, index) => {
        if (part.match(/\[\[\d+\]\]/)) {
          const id = part.replace(/[\[\]]/g, '');
          return (
            <button
              key={index}
              onClick={(e) => {
                if (isPreview) return;
                e.preventDefault();
                e.stopPropagation();
                navigate(`/note/${id}`);
              }}
              className={`text-amber-600 dark:text-amber-400 font-mono font-bold decoration-dotted underline underline-offset-4 px-1 rounded hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors ${
                isPreview ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {part}
            </button>
          );
        }
        return part;
      });
    });
  };

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none 
                    ${isPreview ? 'prose-sm' : 'prose-lg'}
                    prose-headings:font-serif prose-headings:font-bold 
                    prose-a:text-amber-600 dark:prose-a:text-amber-400`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // We wrap the paragraph and list items to process their text
          p: ({ children }) => <p>{formatWikiLinks(children)}</p>,
          li: ({ children }) => <li>{formatWikiLinks(children)}</li>,
          // If you use headers with links, add them here too:
          h1: ({ children }) => <h1>{formatWikiLinks(children)}</h1>,
          h2: ({ children }) => <h2>{formatWikiLinks(children)}</h2>,
          h3: ({ children }) => <h3>{formatWikiLinks(children)}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;