// SVG cache to avoid repeated fetches
const svgCache: Record<string, string> = {};

/**
 * Loads an SVG file and returns its content
 */
export async function loadSvg(iconName: string): Promise<string> {
  // Return from cache if available
  if (svgCache[iconName]) {
    return svgCache[iconName];
  }

  try {
    const response = await fetch(`/deviceicons/${iconName}.svg`);
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.statusText}`);
    }
    
    const svgText = await response.text();
    // Store in cache
    svgCache[iconName] = svgText;
    return svgText;
  } catch (error) {
    console.error(`Error loading SVG ${iconName}:`, error);
    return ''; // Return empty string on error
  }
}