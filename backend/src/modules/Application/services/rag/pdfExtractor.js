import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfPkg = require('pdf-parse');
const PDFParse = pdfPkg.PDFParse || pdfPkg;

/**
 * Clean and normalize raw extracted text
 * @param {string} text - Raw text from PDF stream
 * @returns {string} Cleaned text with normalized line endings
 */
export const cleanText = (text) => {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/[^\S\r\n]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

/**
 * Extract raw text from PDF buffer
 * @param {Buffer} fileBuffer - The PDF file binary buffer
 * @returns {Promise<string>} Extracted and cleaned text content
 */
export const extractPdfText = async (fileBuffer) => {
    try {
        if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
            throw new Error('Invalid file buffer provided for PDF extraction');
        }

        let rawText = '';

        if (typeof PDFParse === 'function' && PDFParse.prototype && PDFParse.prototype.getText) {
            const parser = new PDFParse({ data: fileBuffer });
            const result = await parser.getText();
            if (typeof result === 'string') {
                rawText = result;
            } else if (result && typeof result.text === 'string') {
                rawText = result.text;
            } else if (result && Array.isArray(result.pages)) {
                rawText = result.pages.map(page => page.text || '').join('\n');
            }
        } else if (typeof pdfPkg === 'function') {
            const data = await pdfPkg(fileBuffer);
            rawText = data.text || '';
        } else {
            throw new Error('No compatible PDF parser engine found');
        }

        const cleaned = cleanText(rawText);

        if (!cleaned || cleaned.length < 20) {
            throw new Error('Unable to extract text from the PDF file. The document may be scanned or image-based.');
        }

        return cleaned;

    } catch (error) {
        console.error('Error in extractPdfText:', error.message);
        throw error;
    }
};

export default extractPdfText;
