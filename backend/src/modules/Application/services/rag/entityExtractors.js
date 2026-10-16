/**
 * entityExtractors.js
 * Scans the ENTIRE document without line-number restrictions
 * to extract structured entities (links, emails, phones, names, skills, location).
 */

const KNOWN_SKILLS = [
    "JavaScript", "TypeScript", "React", "React Native", "Next.js", "Vue.js", "Angular",
    "Node.js", "Express", "NestJS", "Python", "Django", "Flask", "FastAPI", "Java",
    "Spring Boot", "C++", "C#", ".NET", "Go", "Golang", "Rust", "PHP", "Laravel",
    "Ruby", "Ruby on Rails", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "Elasticsearch", "GraphQL", "REST API", "Docker", "Kubernetes", "AWS", "Azure",
    "GCP", "Google Cloud", "CI/CD", "Git", "GitHub", "GitLab", "Linux", "HTML", "HTML5",
    "CSS", "CSS3", "Tailwind CSS", "Tailwind", "Bootstrap", "Sass", "Redux", "Zustand",
    "Jest", "Cypress", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
    "Pandas", "NumPy", "Scikit-Learn", "Figma", "Agile", "Scrum", "Microservices",
    "Kafka", "RabbitMQ", "Prisma", "Sequelize", "Mongoose", "Firebase", "Supabase"
];

/**
 * Extract all URLs from the document and categorize them
 * @param {string} text - Full resume text
 * @returns {Object} Classified URLs and best portfolio URL
 */
export const extractUrls = (text) => {
    if (!text) return { portfolioUrl: '', allUrls: [] };

    const urlRegex = /(?:https?:\/\/|www\.)[^\s,;"'<>]+|(?:github\.com|linkedin\.com\/in)\/[^\s,;"'<>]+/gi;
    const matches = text.match(urlRegex) || [];

    const cleanUrls = matches.map(u => {
        let clean = u.replace(/[.,;:)\]]+$/, ''); // Strip trailing punctuation
        if (!clean.startsWith('http')) {
            clean = `https://${clean}`;
        }
        return clean;
    });

    const uniqueUrls = Array.from(new Set(cleanUrls));

    // Priority ranking: GitHub / LinkedIn / Personal Portfolio > Generic
    const portfolioUrl = uniqueUrls.find(url => /github\.com/i.test(url)) ||
                         uniqueUrls.find(url => /linkedin\.com/i.test(url)) ||
                         uniqueUrls.find(url => !/twitter\.com|facebook\.com|instagram\.com/i.test(url)) ||
                         uniqueUrls[0] || '';

    return {
        portfolioUrl,
        allUrls: uniqueUrls
    };
};

/**
 * Extract email addresses from anywhere in the document
 * @param {string} text - Full resume text
 * @returns {string} Primary email
 */
export const extractEmail = (text) => {
    if (!text) return '';
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches && matches.length > 0 ? matches[0].trim().toLowerCase() : '';
};

/**
 * Extract phone number from anywhere in the document
 * @param {string} text - Full resume text
 * @returns {string} Primary phone number
 */
export const extractPhone = (text) => {
    if (!text) return '';
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[-.\s]?[6-9]\d{9}|(?:\+?\d{1,2}\s?)?\b[6-9]\d{9}\b/g;
    const matches = text.match(phoneRegex);
    return matches && matches.length > 0 ? matches[0].trim() : '';
};

/**
 * Extract location from anywhere in the document
 * @param {string} text - Full resume text
 * @returns {string} Location string
 */
export const extractLocation = (text) => {
    if (!text) return '';
    // Look for explicit prefix first
    const explicitMatch = text.match(/(?:location|address|city|residence|based in)[:\s]+([^\n\r,|]+(?:,[^\n\r,|]+)?)/i);
    if (explicitMatch && explicitMatch[1]) {
        return explicitMatch[1].trim();
    }

    // Pattern for common "City, Country" or "City, State"
    const cityStatePattern = /\b([A-Z][a-zA-Z\s]{2,20}),\s*([A-Z][a-zA-Z\s]{2,20})\b/;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 15)) {
        // Exclude lines with email or headers
        if (!line.includes('@') && !/experience|education|skills|summary|projects/i.test(line)) {
            const match = line.match(cityStatePattern);
            if (match) {
                return match[0].trim();
            }
        }
    }

    return '';
};

/**
 * Extract candidate name using semantic markers and title filtering
 * @param {string} text - Full resume text
 * @returns {string} Candidate full name
 */
export const extractCandidateName = (text) => {
    if (!text) return '';

    // Check for explicit "Name: John Doe"
    const explicitMatch = text.match(/(?:name|full\s*name|candidate\s*name)[:\s]+([A-Za-z\s.-]{2,35})/i);
    if (explicitMatch && explicitMatch[1]) {
        return explicitMatch[1].trim();
    }

    // Examine non-empty lines, looking for a valid 2-4 word personal name
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const ignoreWords = /curriculum|vitae|resume|profile|summary|experience|engineer|developer|manager|contact|page|email|phone|http|www/i;

    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const line = lines[i];
        if (!line.includes('@') && !/\d/.test(line) && !ignoreWords.test(line)) {
            const cleaned = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
            const words = cleaned.split(/\s+/).filter(Boolean);
            if (words.length >= 2 && words.length <= 4 && cleaned.length >= 4 && cleaned.length <= 35) {
                return cleaned;
            }
        }
    }

    return '';
};

/**
 * Extract skills by matching against the technology ontology across the entire text
 * @param {string} text - Full resume text
 * @returns {string} Comma-separated list of identified skills
 */
export const extractSkills = (text) => {
    if (!text) return '';
    const lowerText = text.toLowerCase();
    const matched = [];

    for (const skill of KNOWN_SKILLS) {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(lowerText)) {
            matched.push(skill);
        }
    }

    return Array.from(new Set(matched)).slice(0, 20).join(', ');
};

/**
 * Comprehensive document-wide entity extractor
 * @param {string} text - Full resume text
 * @returns {Object} Structured extracted entities
 */
export const extractAllEntities = (text) => {
    try {
        const { portfolioUrl, allUrls } = extractUrls(text);
        return {
            fullName: extractCandidateName(text),
            email: extractEmail(text),
            phone: extractPhone(text),
            location: extractLocation(text),
            portfolio: portfolioUrl,
            allUrls,
            skills: extractSkills(text)
        };
    } catch (error) {
        console.error('Error in extractAllEntities:', error);
        return {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            portfolio: '',
            allUrls: [],
            skills: ''
        };
    }
};

export default extractAllEntities;
