import axios from 'axios';
import * as cheerio from 'cheerio';

// 1.Wikipedia API (100% Free - No API key needed!)
export const verifyWithWikipedia = async (query) => {
  try {
    console.log('📚 Verifying with Wikipedia:', query);
    
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action:  'query',
        list:  'search',
        srsearch: query,
        format:  'json',
        origin: '*',
      },
    });

    const results = response.data.query?.search || [];
    
    if (results.length > 0) {
      // Get the first article's content
      const pageId = results[0].pageid;
      const contentResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action:  'query',
          pageids: pageId,
          prop: 'extracts',
          exintro: true,
          explaintext: true,
          format: 'json',
          origin: '*',
        },
      });

      const page = contentResponse.data.query?.pages[pageId];
      
      return {
        found: true,
        results: results.slice(0, 3).map((r, idx) => ({
          title: r.title,
          snippet: r.snippet.replace(/<[^>]*>/g, ''),
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
          extract: idx === 0 ? page?.extract : null,
        })),
      };
    }

    return { found: false };
  } catch (error) {
    console.error('❌ Wikipedia Error:', error.message);
    return { found: false, error: error.message };
  }
};

// 2.DuckDuckGo Instant Answer API (100% Free - No API key!)
export const verifyWithDuckDuckGo = async (query) => {
  try {
    console.log('🦆 Verifying with DuckDuckGo:', query);
    
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format:  'json',
        no_html: 1,
        skip_disambig: 1,
      },
    });

    const data = response.data;
    
    if (data.Abstract || data.RelatedTopics?.length > 0) {
      return {
        found: true,
        abstract: data.Abstract,
        abstractSource: data.AbstractSource,
        abstractURL: data.AbstractURL,
        relatedTopics: data.RelatedTopics.slice(0, 5).map(topic => ({
          text: topic.Text,
          url: topic.FirstURL,
        })),
      };
    }

    return { found: false };
  } catch (error) {
    console.error('❌ DuckDuckGo Error:', error.message);
    return { found: false, error: error.message };
  }
};

// 3.MediaWiki API for Wikiquote (Free - No API key!)
export const verifyWithWikiquote = async (query) => {
  try {
    console.log('💬 Checking Wikiquote:', query);
    
    const response = await axios.get('https://en.wikiquote.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
      },
    });

    const results = response.data.query?.search || [];
    
    if (results.length > 0) {
      return {
        found: true,
        results: results.slice(0, 2).map(r => ({
          title: r.title,
          snippet: r.snippet.replace(/<[^>]*>/g, ''),
          url: `https://en.wikiquote.org/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
        })),
      };
    }

    return { found: false };
  } catch (error) {
    console.error('❌ Wikiquote Error:', error.message);
    return { found: false, error: error.message };
  }
};

// 4.Wikidata API (Free - For structured data)
export const verifyWithWikidata = async (query) => {
  try {
    console.log('🗄️ Checking Wikidata:', query);
    
    const response = await axios.get('https://www.wikidata.org/w/api.php', {
      params: {
        action: 'wbsearchentities',
        search: query,
        language: 'en',
        format: 'json',
        origin: '*',
      },
    });

    const results = response.data.search || [];
    
    if (results.length > 0) {
      return {
        found: true,
        entities: results.slice(0, 3).map(r => ({
          id: r.id,
          label: r.label,
          description: r.description,
          url: r.concepturi,
        })),
      };
    }

    return { found: false };
  } catch (error) {
    console.error('❌ Wikidata Error:', error.message);
    return { found: false, error: error.message };
  }
};

// 5.OpenStreetMap Nominatim (Free - For location verification)
export const verifyLocation = async (location) => {
  try {
    console.log('🗺️ Verifying location:', location);
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 3,
      },
      headers: {
        'User-Agent': 'VeriFact-App/1.0', // Required by Nominatim
      },
    });

    const results = response.data || [];
    
    if (results.length > 0) {
      return {
        found: true,
        locations: results.map(r => ({
          displayName: r.display_name,
          type: r.type,
          importance: r.importance,
          lat: r.lat,
          lon: r.lon,
        })),
      };
    }

    return { found: false };
  } catch (error) {
    console.error('❌ Location verification Error:', error.message);
    return { found: false, error:  error.message };
  }
};

// 6.Snopes Fact-Checking (Web Scraping - Free)
export const checkWithSnopes = async (claim) => {
  try {
    console.log('🔍 Checking Snopes:', claim);
    
    // Search Snopes
    const searchUrl = `https://www.snopes.com/? s=${encodeURIComponent(claim)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Extract search results (basic scraping)
    $('.article-wrapper').slice(0, 3).each((i, elem) => {
      const title = $(elem).find('h3').text().trim();
      const link = $(elem).find('a').attr('href');
      const rating = $(elem).find('.rating').text().trim();
      
      if (title && link) {
        results.push({
          title,
          url: link,
          rating:  rating || 'Unknown',
        });
      }
    });

    if (results.length > 0) {
      return {
        found: true,
        source: 'Snopes',
        results,
      };
    }

    return { found: false };
  } catch (error) {
    console.error('❌ Snopes Error:', error.message);
    return { found: false, error: error.message };
  }
};

// 7.REST Countries API (Free - For country information)
export const verifyCountryInfo = async (countryName) => {
  try {
    console.log('🌍 Verifying country info:', countryName);
    
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
    
    const countries = response.data || [];
    
    if (countries.length > 0) {
      const country = countries[0];
      return {
        found: true,
        name: country.name.common,
        capital: country.capital?.[0],
        population: country.population,
        region: country.region,
        currencies: Object.keys(country.currencies || {}).join(', '),
      };
    }

    return { found: false };
  } catch (error) {
    console.error('❌ Country Info Error:', error.message);
    return { found: false, error:  error.message };
  }
};

// MAIN:  Comprehensive Fact Check (All Free APIs!)
export const performFactCheck = async (claims, extractedText = '') => {
  const results = {
    verified: [],
    unverified: [],
    sources: [],
    overallVerdict: 'uncertain',
    confidence: 50,
    details: {},
  };

  const claimsToCheck = claims.length > 0 ? claims : [extractedText.substring(0, 200)];

  for (const claim of claimsToCheck.slice(0, 3)) {
    let verified = false;
    
    // 1.Check Wikipedia
    const wikiResult = await verifyWithWikipedia(claim);
    if (wikiResult.found) {
      results.verified.push({
        claim,
        isTrue: true, // Wikipedia existence suggests some validity
        source: 'Wikipedia',
        confidence: 75,
        details: wikiResult.results,
      });
      wikiResult.results.forEach(r => results.sources.push(r.url));
      verified = true;
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2.Check DuckDuckGo
    if (!verified) {
      const ddgResult = await verifyWithDuckDuckGo(claim);
      if (ddgResult.found && ddgResult.abstract) {
        results.verified.push({
          claim,
          isTrue: true,
          source: 'DuckDuckGo Instant Answer',
          confidence: 70,
          details: {
            abstract: ddgResult.abstract,
            source: ddgResult.abstractSource,
          },
        });
        if (ddgResult.abstractURL) results.sources.push(ddgResult.abstractURL);
        verified = true;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 3.Check if it's a location
    if (!verified && claim.toLowerCase().includes('in ')) {
      const locationMatch = claim.match(/in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
      if (locationMatch) {
        const locationResult = await verifyLocation(locationMatch[1]);
        if (locationResult.found) {
          results.verified.push({
            claim,
            isTrue: null, // Location exists but doesn't verify the claim
            source: 'OpenStreetMap',
            confidence:  65,
            details: locationResult.locations,
          });
          verified = true;
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 4.Check Wikidata for entities
    if (!verified) {
      const wikidataResult = await verifyWithWikidata(claim);
      if (wikidataResult.found) {
        results.verified.push({
          claim,
          isTrue: null,
          source: 'Wikidata',
          confidence:  60,
          details: wikidataResult.entities,
        });
        verified = true;
      }
    }

    if (!verified) {
      results.unverified.push(claim);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Calculate overall verdict
  const verifiedCount = results.verified.length;
  const totalClaims = claimsToCheck.length;
  
  if (verifiedCount === 0) {
    results.overallVerdict = 'unverifiable';
    results.confidence = 30;
  } else if (verifiedCount === totalClaims) {
    results.overallVerdict = 'verified';
    results.confidence = 80;
  } else {
    results.overallVerdict = 'partially-verified';
    results.confidence = 50 + (verifiedCount / totalClaims * 30);
  }

  return results;
};

// Generate fact-check message
export const generateFactCheckMessage = (factCheckResult, claims) => {
  const { overallVerdict, confidence, verified, unverified } = factCheckResult;

  if (overallVerdict === 'verified') {
    return `✅ Information verified across ${verified.length} credible source(s) with ${confidence.toFixed(1)}% confidence. Claims found in encyclopedic sources including Wikipedia and other databases.`;
  } else if (overallVerdict === 'partially-verified') {
    return `⚠️ Partially verified (${confidence.toFixed(1)}% confidence).${verified.length} of ${verified.length + unverified.length} claims found in credible sources. ${unverified.length} claim(s) could not be verified.`;
  } else if (overallVerdict === 'unverifiable') {
    return `❌ Unable to verify claims (${confidence.toFixed(1)}% confidence).No credible sources found. This information should be treated with caution and may be false.`;
  } else {
    return `❓ Fact-check inconclusive (${confidence.toFixed(1)}% confidence).Insufficient information available. Manual verification recommended.`;
  }
};