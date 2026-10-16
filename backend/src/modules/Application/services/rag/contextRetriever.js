/**
 * contextRetriever.js
 * The Retrieval Engine of the RAG pipeline.
 * Selects, scores, and compiles relevant chunks based on target schema requirements.
 */

/**
 * Retrieve and structure chunks relevant to target application fields
 * @param {Array<Object>} chunks - Array of semantic chunks from documentChunker
 * @returns {string} Formatted, high-relevance retrieved context for LLM prompt
 */
export const retrieveContextForForm = (chunks = []) => {
    try {
        if (!Array.isArray(chunks) || chunks.length === 0) {
            return 'No document context available.';
        }

        // Group chunks by semantic type
        const grouped = {
            header: [],
            contact: [],
            summary: [],
            experience: [],
            skills: [],
            projects: [],
            education: [],
            other: []
        };

        for (const chunk of chunks) {
            if (grouped[chunk.section]) {
                grouped[chunk.section].push(chunk.text);
            } else {
                grouped.other.push(chunk.text);
            }
        }

        // Build targeted retrieval blocks
        const contextParts = [];

        // 1. Personal & Contact Context
        const contactBlock = [
            ...grouped.header,
            ...grouped.contact
        ].join('\n\n');
        if (contactBlock) {
            contextParts.push(`=== CONTACT & PERSONAL SECTION ===\n${contactBlock}`);
        }

        // 2. Summary & Profile Context
        if (grouped.summary.length > 0) {
            contextParts.push(`=== SUMMARY & OBJECTIVE SECTION ===\n${grouped.summary.join('\n\n')}`);
        }

        // 3. Experience Context (Cap to prevent overflowing prompt while preserving key roles)
        if (grouped.experience.length > 0) {
            const expText = grouped.experience.join('\n\n').slice(0, 3500);
            contextParts.push(`=== WORK EXPERIENCE SECTION ===\n${expText}`);
        }

        // 4. Skills & Technologies Context
        if (grouped.skills.length > 0) {
            contextParts.push(`=== SKILLS SECTION ===\n${grouped.skills.join('\n\n')}`);
        }

        // 5. Projects & Links Context
        if (grouped.projects.length > 0) {
            const projText = grouped.projects.join('\n\n').slice(0, 2000);
            contextParts.push(`=== PROJECTS SECTION ===\n${projText}`);
        }

        // 6. Education Context
        if (grouped.education.length > 0) {
            const eduText = grouped.education.join('\n\n').slice(0, 1000);
            contextParts.push(`=== EDUCATION SECTION ===\n${eduText}`);
        }

        // 7. Fallback for unclassified text
        if (grouped.other.length > 0 && contextParts.length === 0) {
            contextParts.push(`=== GENERAL CONTENT ===\n${grouped.other.join('\n\n').slice(0, 3000)}`);
        }

        return contextParts.join('\n\n');

    } catch (error) {
        console.error('Error in retrieveContextForForm:', error);
        // Fallback: join all chunk texts
        return chunks.map(c => c.text).join('\n\n').slice(0, 4000);
    }
};

export default retrieveContextForForm;
