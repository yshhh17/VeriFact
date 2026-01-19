// Extract claims from text
export const extractClaims = (text) => {
  const claims = [];
  
  // Split into sentences
  const sentences = text. match(/[^\. !\?]+[\.!\?]+/g) || [text];
  
  // Patterns that indicate factual claims
  const claimPatterns = [
    // Dates and events
    /(?:yesterday|today|tomorrow|on|in)\s+(?:\d{4}|\w+\s+\d{1,2})/i,
    // Statistics and numbers
    /\d+(?:\.\d+)?%|\d+\s+(?: million|billion|thousand)/i,
    // Named entities (people, places, organizations)
    /(?:according to|reported by|announced|confirmed)\s+[\w\s]+/i,
    // Locations
    /\bin\s+(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    // Events
    /(?:collapsed|launched|died|arrested|discovered|invented|won|lost)/i,
  ];

  sentences.forEach(sentence => {
    sentence = sentence.trim();
    
    // Skip very short sentences
    if (sentence. split(' ').length < 4) return;
    
    // Check if sentence contains claim patterns
    const hasClaimPattern = claimPatterns.some(pattern => pattern.test(sentence));
    
    if (hasClaimPattern) {
      claims.push(sentence);
    }
  });

  // Also extract specific claim types
  const extractedData = {
    dates: extractDates(text),
    locations: extractLocations(text),
    numbers: extractNumbers(text),
    entities: extractEntities(text),
  };

  return {
    claims: [... new Set(claims)], // Remove duplicates
    extractedData,
  };
};

// Extract dates from text
const extractDates = (text) => {
  const datePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{2,4}/g, // 12/31/2023
    /\d{4}-\d{2}-\d{2}/g, // 2023-12-31
    /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,
    /yesterday|today|tomorrow/gi,
  ];

  const dates = [];
  datePatterns. forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) dates.push(...matches);
  });

  return [... new Set(dates)];
};

// Extract locations
const extractLocations = (text) => {
  // Simple pattern for capitalized place names
  const locationPattern = /\bin\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
  const locations = [];
  let match;

  while ((match = locationPattern. exec(text)) !== null) {
    locations.push(match[1]);
  }

  return [...new Set(locations)];
};

// Extract numbers and statistics
const extractNumbers = (text) => {
  const numberPatterns = [
    /\d+(?:\.\d+)?%/g, // Percentages
    /\$\d+(?:\.\d+)?(?:\s*(?:million|billion|thousand))?/gi, // Money
    /\d+\s+(?:million|billion|thousand)/gi, // Large numbers
  ];

  const numbers = [];
  numberPatterns. forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) numbers.push(...matches);
  });

  return [...new Set(numbers)];
};

// Extract named entities (basic)
const extractEntities = (text) => {
  // Look for proper nouns (capitalized words not at sentence start)
  const words = text.split(/\s+/);
  const entities = [];

  for (let i = 1; i < words.length; i++) {
    const word = words[i].replace(/[^\w]/g, '');
    if (word.length > 2 && /^[A-Z][a-z]+/. test(word)) {
      entities.push(word);
    }
  }

  // Filter common words
  const commonWords = ['The', 'This', 'That', 'These', 'Those', 'When', 'Where', 'What', 'Who', 'Why', 'How'];
  return [...new Set(entities.filter(e => ! commonWords.includes(e)))];
};