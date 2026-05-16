import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import useNoteStore from "../store/useNoteStore";

const MarkdownRenderer = ({ content, isPreview = false }) => {
  const navigate = useNavigate();
  const { bokses } = useNoteStore();

  // FIX: Flatten EVERY note from EVERY folder into one massive array
  const allNotes = bokses.flatMap((b) => b.notes);

  const slugify = (str) =>
    str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");

  const processedContent = content
    ? content.replace(/\[\[(.*?)\]\]/g, (match, innerText) => {
        return `[${innerText}](/wikilink/${encodeURIComponent(innerText)})`;
      })
    : "";

  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none 
                    ${isPreview ? "prose-sm" : "prose-lg"}
                    prose-headings:font-serif prose-headings:font-bold 
                    prose-a:text-amber-600 dark:prose-a:text-amber-400`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, href, children, ...props }) => {
            if (href && href.startsWith("/wikilink/")) {
              const rawText = decodeURIComponent(href.replace("/wikilink/", ""));
              const targetSlug = slugify(rawText);

              return (
                <button
                  onClick={(e) => {
                    if (isPreview) return;
                    e.preventDefault();
                    e.stopPropagation();

                    const searchStr = rawText.toLowerCase().trim();

                    // AGGRESSIVE GLOBAL LOOKUP
                    let targetNote = allNotes.find((n) => {
                      const noteId = n.id.toLowerCase();
                      const noteTitle = n.title.toLowerCase();

                      return (
                        noteId === searchStr ||
                        noteId === targetSlug ||
                        noteTitle === searchStr ||
                        slugify(n.title) === targetSlug ||
                        noteTitle.includes(searchStr) // This catches "VP0016" inside "VP0016 - Value Area"
                      );
                    });

                    // If it finds the note anywhere, go to its exact database ID
                    const finalId = targetNote ? targetNote.id : targetSlug;
                    navigate(`/note/${finalId}`);
                  }}
                  className={`text-amber-600 dark:text-amber-400 font-mono font-bold decoration-dotted underline underline-offset-4 px-1 rounded hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors inline-block ${
                    isPreview ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  {children}
                </button>
              );
            }

            const isExternal = href && href.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : "_self"}
                rel={isExternal ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;