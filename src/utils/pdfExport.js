import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportBoksToPdf = async (boks) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let cursorY = margin;

  // 1. Add Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(15, 23, 42); 
  
  // FIX: Measure and wrap the long title
  const maxTitleWidth = pageWidth - (margin * 2);
  const titleLines = pdf.splitTextToSize(boks.name, maxTitleWidth);
  
  // Print the array of lines
  pdf.text(titleLines, margin, cursorY);
  
  // Advance the Y cursor based on how many lines the title took
  // Font size 22 is roughly 8-9mm per line
  cursorY += (titleLines.length * 9); 
  
  // Add the subtitle/date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Collection Export • ${new Date().toLocaleDateString()}`, margin, cursorY);
  
  // Add a gap before the notes start
  cursorY += 15;

  // 2. Process each note individually
  for (const note of boks.notes) {
    const tempDiv = document.createElement('div');
    
    // FIX 1: Move it off-screen, but leave it fully opaque
    Object.assign(tempDiv.style, {
      width: '650px',
      padding: '20px',
      position: 'absolute',
      top: '0',
      left: '-9999px', // Shove it way off to the left
      backgroundColor: '#ffffff', // Ensure solid background
      zIndex: '-1000'
    });

    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #1e293b;">
        <h2 style="color: #b45309; font-size: 20px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          ${note.title}
        </h2>
        <div style="font-size: 13px; line-height: 1.6; white-space: pre-wrap; color: #334155;">
          ${note.content}
        </div>
        <div style="margin-top: 10px; font-size: 9px; color: #94a3b8;">
          Tags: ${note.tags.join(', ')}
        </div>
      </div>
    `;
    
    document.body.appendChild(tempDiv);

    try {
      // FIX 2: Yield to the browser so it can physically lay out the text
      await new Promise(resolve => setTimeout(resolve, 10));

      // 3. Capture the note as a canvas
      const canvas = await html2canvas(tempDiv, { 
        scale: 2, 
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 4. Handle Page Breaks
      if (cursorY + imgHeight > pageHeight - margin) {
        pdf.addPage();
        cursorY = margin;
      }

      pdf.addImage(imgData, 'JPEG', margin, cursorY, imgWidth, imgHeight);
      cursorY += imgHeight + 12; // Gap between notes

    } catch (err) {
      console.error("Error rendering note:", note.title, err);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }

  // 5. Final Save
  pdf.save(`${boks.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};