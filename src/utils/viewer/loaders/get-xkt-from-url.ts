/**
 * Extracts UUID from a URL, fetches project data, and returns XKT file information.
 * @param {string} url - The input URL containing a UUID.
 * @returns {Promise<object[]|null>} Array of XKT fileName and url or null if not found/error.
 */
async function getXKTFromUrl(url) {
    // Extract UUID from the URL
    const uuidRegex = /\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
    const match = url.match(uuidRegex);
    const uuid = match ? match[1] : null;
  
    if (!uuid) {
      console.log('No UUID found in the URL');
      return null;
    }
  
    console.log('Extracted UUID:', uuid);
  
    // Fetch project data
    try {
      const apiUrl = `https://xeo.vision/api/projects/${uuid}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const projectData = await response.json();
      
      // Extract XKT entries from model3dEntries and their model3dOutputs
      const xktEntries = projectData.model3dEntries.flatMap(entry => 
        entry.model3dOutputs
          .filter(output => output.fileType === "xkt")
          .map(({ fileName, url }) => ({ fileName, url }))
      );
      
      if (xktEntries.length === 0) {
        console.log('No XKT entries found in the project data');
        return null;
      }
      
      console.log('XKT Entries:', xktEntries);
      return xktEntries;
    } catch (error) {
      console.error('Error processing project data:', (error as Error).message);
      return null;
    }
}

export default getXKTFromUrl;