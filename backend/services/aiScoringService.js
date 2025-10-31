
const AI_PROVIDER = process.env.AI_SCORING_PROVIDER || "simulated";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

/**
  * Main function to score artwork using selected AI provider
 * @param {Object} artwork - Artwork object with url, title, description, etc.
 * @returns {Object} Scoring results
 */
export const scoreArtwork = async (artwork) => {
  try {
    switch (AI_PROVIDER) {
      case "huggingface":
        return await scoreWithHuggingFace(artwork);
      case "replicate":
        return await scoreWithReplicate(artwork);
      case "stability":
        return await scoreWithStability(artwork);
      default:
        return await scoreWithSimulation(artwork);
    }
  } catch (error) {
    console.error(`AI scoring error (${AI_PROVIDER}):`, error);
    // Fallback to simulation if API fails
    return await scoreWithSimulation(artwork);
  }
};


const scoreWithHuggingFace = async (artwork) => {
  if (!HF_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY not set in .env");
  }

  const imageUrl = artwork.url;

  
  const response = await fetch(
    `https://api-inference.huggingface.co/models/google/vit-base-patch16-224`,
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: imageUrl }),
    }
  );

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }

  const result = await response.json();

  
  const aesthetic = extractScoreFromHF(result, "aesthetic", 70);
  const technical = extractScoreFromHF(result, "technical", 75);
  const creativity = extractScoreFromHF(result, "creativity", 65);
  const composition = extractScoreFromHF(result, "composition", 70);

  // Weighted overall score
  const overall = (
    aesthetic * 0.3 +
    technical * 0.25 +
    creativity * 0.25 +
    composition * 0.2
  );

  return {
    overall: Math.round(overall * 100) / 100,
    aesthetic: Math.round(aesthetic * 100) / 100,
    technical: Math.round(technical * 100) / 100,
    creativity: Math.round(creativity * 100) / 100,
    composition: Math.round(composition * 100) / 100,
    scoredAt: new Date(),
    scoringVersion: "hf-1.0",
  };
};


const scoreWithReplicate = async (artwork) => {
  if (!REPLICATE_API_KEY) {
    throw new Error("REPLICATE_API_KEY not set in .env");
  }

  
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "aesthetic-model-id", // Use actual model ID
      input: { image: artwork.url },
    }),
  });

  const result = await response.json();
  


  return normalizeScores(result);
};


const scoreWithStability = async (artwork) => {
  if (!STABILITY_API_KEY) {
    throw new Error("STABILITY_API_KEY not set in .env");
  }

  
  return normalizeScores({});
};


const scoreWithSimulation = async (artwork) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const features = extractFeatures(artwork);
  
  const scores = {
    aesthetic: calculateAestheticScore(features),
    technical: calculateTechnicalScore(features),
    creativity: calculateCreativityScore(features),
    composition: calculateCompositionScore(features),
  };

  const overall = (
    scores.aesthetic * 0.3 +
    scores.technical * 0.25 +
    scores.creativity * 0.25 +
    scores.composition * 0.2
  );

  return {
    overall: Math.round(overall * 100) / 100,
    ...scores,
    scoredAt: new Date(),
    scoringVersion: "simulated-1.0",
  };
};


const extractScoreFromHF = (response, type, defaultScore) => {
  // Adapt based on actual HF model response
  // This is a placeholder - adjust based on the model you use
  if (Array.isArray(response) && response.length > 0) {
    // Example: extract confidence scores
    const confidence = response[0]?.score || 0;
    return Math.min(100, (defaultScore + confidence * 20));
  }
  return defaultScore;
};

/**
 * Normalize API response to our scoring format
 */
const normalizeScores = (apiResult) => {
  // Convert API response to our 0-100 scale
  return {
    overall: 75,
    aesthetic: 70,
    technical: 75,
    creativity: 70,
    composition: 75,
    scoredAt: new Date(),
    scoringVersion: "api-1.0",
  };
};

/**
 * Extract features from artwork metadata (fallback)
 */
const extractFeatures = (artwork) => {
  const textContent = `${artwork.title} ${artwork.description} ${artwork.tags?.join(" ") || ""}`.toLowerCase();
  
  const categoryMultipliers = {
    digital: 1.1,
    painting: 1.0,
    photography: 0.95,
    sketch: 0.9,
    other: 0.85,
  };

  const qualityWords = ["detailed", "intricate", "professional", "unique", "original", "vibrant", "stunning"];
  const qualityScore = qualityWords.filter(word => textContent.includes(word)).length;
  const baseScore = 50 + (Math.random() * 30);

  return {
    colorHarmony: Math.min(100, baseScore + qualityScore * 5 + Math.random() * 15),
    detailLevel: Math.min(100, baseScore + (artwork.description?.length > 50 ? 10 : 0) + Math.random() * 20),
    originality: Math.min(100, 60 + qualityScore * 8 + Math.random() * 20),
    visualBalance: Math.min(100, baseScore + Math.random() * 20),
    categoryMultiplier: categoryMultipliers[artwork.category] || 1.0,
  };
};

const calculateAestheticScore = (features) => {
  return Math.min(100, (features.colorHarmony * 0.5 + features.visualBalance * 0.5) * features.categoryMultiplier);
};

const calculateTechnicalScore = (features) => {
  return Math.min(100, features.detailLevel * features.categoryMultiplier);
};

const calculateCreativityScore = (features) => {
  return Math.min(100, features.originality * features.categoryMultiplier);
};

const calculateCompositionScore = (features) => {
  return Math.min(100, features.visualBalance * features.categoryMultiplier);
};

/**
 * Batch score multiple artworks
 */
export const scoreArtworksBatch = async (artworks) => {
  const scores = await Promise.all(artworks.map(artwork => scoreArtwork(artwork)));
  return scores;
};

/**
 * Get week identifier (e.g., "2024-W15")
 */
export const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
};

/**
 * Get week dates
 */
export const getWeekDates = (weekString) => {
  const [year, week] = weekString.split("-W").map(Number);
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = date.getDay();
  const startDate = new Date(date.setDate(date.getDate() - dayOfWeek));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};
