export const exportToJson = (data) => {
  // Safety check: Don't export if data is null or undefined
  if (!data) {
    console.error("Export failed: No data provided.");
    alert("Export failed: No data found to save.");
    return;
  }

  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Explicitly check if stringify resulted in "undefined"
    if (jsonString === undefined) {
      throw new Error("Data could not be serialized to JSON.");
    }

    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `noteboks-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export Error:", error);
    alert("Export failed: " + error.message);
  }
};