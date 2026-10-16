/**
 * documentChunker.js
 * Segments raw resume text into semantic chunks with metadata
 * without relying on arbitrary line-count slicing.
 */

const SECTION_HEADERS = [
    {
        type: 'experience',
        pattern: /^(?:work\s+experience|professional\s+experience|experience|employment\s+history|work\s+history|career\s+history)\b/i
    },
    {
        type: 'skills',
        pattern: /^(?:technical\s+skills|skills\s+(?:&|and)\s+technologies|skills\s+(?:&|and)\s+tools|core\s+competencies|technologies|skills)\b/i
    },
    {
        type: 'education',
        pattern: /^(?:education|academic\s+background|qualifications|academic\s+credentials)\b/i
    },
    {
        type: 'projects',
        pattern: /^(?:projects|personal\s+projects|key\s+projects|notable\s+projects|technical\s+projects)\b/i
    },
    {
        type: 'summary',
        pattern: /^(?:professional\s+summary|summary|profile|about\s+me|career\s+objective|executive\s+summary)\b/i
    },
    {
        type: 'contact',
        pattern: /^(?:contact\s+information|contact\s+details|personal\s+details|contact\s+me)\b/i
    },
    {
        type: 'certifications',
        pattern: /^(?:certifications|licenses\s+(?:&|and)\s+certifications|achievements)\b/i
    }
];

/**
 * Determine if a given line is a section heading
 * @param {string} line - A single line of text
 * @returns {string|null} The section type if matched, or null
 */
const detectSectionHeader = (line) => {
    if (!line) return null;
    const cleanLine = line.replace(/[^a-zA-Z\s]/g, '').trim();

    // Check if line is too long to be a header
    if (cleanLine.length > 50 || cleanLine.split(/\s+/).length > 6) {
        return null;
    }

    for (const { type, pattern } of SECTION_HEADERS) {
        if (pattern.test(cleanLine)) {
            return type;
        }
    }

    return null;
};

/**
 * Chunk resume into semantic sections with metadata
 * @param {string} text - Cleaned resume text
 * @returns {Array<Object>} Array of semantic chunk objects
 */
export const chunkDocument = (text) => {
    try {
        if (!text || typeof text !== 'string') return [];

        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const chunks = [];
        let currentType = 'header';
        let currentLines = [];
        let chunkIndex = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const detectedType = detectSectionHeader(line);

            if (detectedType) {
                // Flush previous section if it has content
                if (currentLines.length > 0) {
                    const chunkText = currentLines.join('\n');
                    chunks.push({
                        id: `chunk_${chunkIndex++}`,
                        section: currentType,
                        text: chunkText,
                        wordCount: chunkText.split(/\s+/).length
                    });
                    currentLines = [];
                }
                currentType = detectedType;
                // Add the header line as the start of the new section
                currentLines.push(line);
            } else {
                currentLines.push(line);
            }
        }

        // Flush remaining lines
        if (currentLines.length > 0) {
            const chunkText = currentLines.join('\n');
            chunks.push({
                id: `chunk_${chunkIndex++}`,
                section: currentType,
                text: chunkText,
                wordCount: chunkText.split(/\s+/).length
            });
        }

        return chunks;

    } catch (error) {
        console.error('Error in chunkDocument:', error);
        // Fallback: return whole text as a single general chunk
        return [{
            id: 'chunk_0',
            section: 'general',
            text: text,
            wordCount: text.split(/\s+/).length
        }];
    }
};

export default chunkDocument;
