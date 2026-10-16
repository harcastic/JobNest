import { extractPdfText } from './rag/pdfExtractor.js';
import { chunkDocument } from './rag/documentChunker.js';
import { retrieveContextForForm } from './rag/contextRetriever.js';
import { extractAllEntities } from './rag/entityExtractors.js';
import { queryLlm } from './rag/llmEngine.js';

/**
 * Reconcile and normalize outputs from LLM and document-wide entity extractors
 * @param {Object} aiResult - Fields extracted by LLM
 * @param {Object} entities - Fields extracted by document-wide pattern matchers
 * @param {Array<Object>} chunks - Semantic document chunks
 * @returns {Object} Final structured application fields
 */
const reconcileExtractedData = (aiResult = {}, entities = {}, chunks = []) => {
    // If experience wasn't returned by LLM, try using the experience/summary chunk
    let experienceFallback = '';
    if (!aiResult.experience) {
        const expChunk = chunks.find(c => c.section === 'experience');
        const sumChunk = chunks.find(c => c.section === 'summary');
        experienceFallback = (expChunk?.text || sumChunk?.text || '').slice(0, 450);
    }

    const finalData = {
        fullName: (aiResult.fullName || entities.fullName || '').trim(),
        email: (aiResult.email || entities.email || '').trim(),
        phone: (aiResult.phone || entities.phone || '').trim(),
        location: (aiResult.location || entities.location || '').trim(),
        experience: (aiResult.experience || experienceFallback || '').trim(),
        skills: (aiResult.skills || entities.skills || '').trim(),
        portfolio: (aiResult.portfolio || entities.portfolio || '').trim(),
        availability: (aiResult.availability || '').trim(),
        salaryExpectation: (aiResult.salaryExpectation || '').trim()
    };

    // Format skills if returned as array
    if (Array.isArray(finalData.skills)) {
        finalData.skills = finalData.skills.join(', ');
    }

    return finalData;
};

/**
 * Main RAG Resume Parsing Pipeline Orchestrator
 * @param {Buffer} fileBuffer - The uploaded PDF resume binary buffer
 * @returns {Promise<Object>} Formatted fields for application auto-fill
 */
export const parseResumeBuffer = async (fileBuffer) => {
    try {
        // Step 1: Extract clean text from PDF binary
        const rawText = await extractPdfText(fileBuffer);

        // Step 2: Dynamic semantic chunking (no line-count limits)
        const chunks = chunkDocument(rawText);

        // Step 3: Document-wide entity scanning (URLs, emails, phones anywhere in text)
        const entities = extractAllEntities(rawText);

        // Step 4: RAG Context Retrieval (select & format high-relevance chunks)
        const retrievedContext = retrieveContextForForm(chunks);

        // Step 5: LLM Structured Extraction (OpenAI / Gemini)
        let aiResult = {};
        try {
            aiResult = await queryLlm(retrievedContext);
        } catch (aiError) {
            console.warn('AI extraction warning (proceeding with entity extractions):', aiError.message);
        }

        // Step 6: Reconcile and clean final output
        const finalData = reconcileExtractedData(aiResult, entities, chunks);

        return finalData;

    } catch (error) {
        console.error('Error in parseResumeBuffer pipeline:', error);
        throw error;
    }
};

export default parseResumeBuffer;
