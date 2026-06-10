const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');

// AI Model for Image Authenticity Detection
class ImageAuthenticityDetector {
  constructor() {
    this.model = null;
    this.isLoaded = false;
  }

  async loadModel() {
    try {
      // For demo purposes, we'll use a simple model or fallback to rule-based
      // In production, load a pre-trained model for image authenticity detection
      console.log('AI Image Authenticity Model initialized (rule-based fallback)');
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load AI model:', error);
      this.isLoaded = false;
    }
  }

  async analyzeImage(imageBuffer) {
    try {
      if (this.isLoaded) {
        return await this.ruleBasedAnalysis(imageBuffer);
      } else {
        return await this.basicAnalysis(imageBuffer);
      }
    } catch (error) {
      console.error('Image analysis failed:', error);
      return {
        isAuthentic: false,
        confidence: 0.5,
        analysis: {
          metadata: {},
          compression: {},
          noise: {},
          artifacts: {},
          aiGenerated: true,
          manipulated: true
        }
      };
    }
  }

  async ruleBasedAnalysis(imageBuffer) {
    const metadata = await this.extractMetadata(imageBuffer);
    const compression = await this.analyzeCompression(imageBuffer);
    const noise = await this.analyzeNoise(imageBuffer);
    const artifacts = await this.analyzeArtifacts(imageBuffer);

    // Rule-based scoring
    let score = 0.5;
    let reasons = [];

    // Check metadata
    if (metadata.hasGPS) score += 0.1;
    if (metadata.hasCameraInfo) score += 0.1;
    if (metadata.creationDate) score += 0.1;

    // Check compression artifacts
    if (compression.quality < 0.8) {
      score -= 0.2;
      reasons.push('Low image quality detected');
    }

    // Check noise patterns
    if (noise.uniformity < 0.7) {
      score -= 0.3;
      reasons.push('Unusual noise patterns detected');
    }

    // Check for AI artifacts
    if (artifacts.aiGenerated) {
      score -= 0.5;
      reasons.push('AI generation artifacts detected');
    }

    // Check for manipulation
    if (artifacts.manipulated) {
      score -= 0.4;
      reasons.push('Image manipulation detected');
    }

    return {
      isAuthentic: score > 0.6,
      confidence: Math.max(0, Math.min(1, score)),
      analysis: {
        metadata,
        compression,
        noise,
        artifacts,
        aiGenerated: artifacts.aiGenerated,
        manipulated: artifacts.manipulated
      },
      reasons
    };
  }

  async basicAnalysis(imageBuffer) {
    const metadata = await this.extractMetadata(imageBuffer);
    
    // Basic authenticity check
    const isAuthentic = metadata.format && metadata.width > 100 && metadata.height > 100;
    
    return {
      isAuthentic,
      confidence: isAuthentic ? 0.7 : 0.3,
      analysis: {
        metadata,
        compression: { quality: 0.8, artifacts: false },
        noise: { uniformity: 0.8, suspicious: false },
        artifacts: { aiGenerated: false, manipulated: false },
        aiGenerated: false,
        manipulated: false
      }
    };
  }

  async extractMetadata(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      return {
        hasGPS: !!metadata.exif,
        hasCameraInfo: !!metadata.exif,
        creationDate: metadata.exif ? new Date() : null,
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels
      };
    } catch (error) {
      return {
        hasGPS: false,
        hasCameraInfo: false,
        creationDate: null,
        format: 'unknown',
        width: 0,
        height: 0,
        channels: 0
      };
    }
  }

  async analyzeCompression(imageBuffer) {
    try {
      const image = sharp(imageBuffer);
      const stats = await image.stats();
      
      const quality = this.calculateCompressionQuality(stats);
      
      return {
        quality,
        artifacts: quality < 0.8,
        compressionLevel: this.estimateCompressionLevel(stats)
      };
    } catch (error) {
      return {
        quality: 0.5,
        artifacts: false,
        compressionLevel: 'unknown'
      };
    }
  }

  async analyzeNoise(imageBuffer) {
    try {
      const image = sharp(imageBuffer);
      const stats = await image.stats();
      
      const uniformity = this.calculateNoiseUniformity(stats);
      
      return {
        uniformity,
        pattern: this.analyzeNoisePattern(stats),
        suspicious: uniformity < 0.7
      };
    } catch (error) {
      return {
        uniformity: 0.5,
        pattern: 'unknown',
        suspicious: false
      };
    }
  }

  async analyzeArtifacts(imageBuffer) {
    try {
      const image = sharp(imageBuffer);
      const stats = await image.stats();
      
      const aiGenerated = this.detectAIGeneratedArtifacts(stats);
      const manipulated = this.detectManipulationArtifacts(stats);
      
      return {
        aiGenerated,
        manipulated,
        artifacts: aiGenerated || manipulated
      };
    } catch (error) {
      return {
        aiGenerated: false,
        manipulated: false,
        artifacts: false
      };
    }
  }

  calculateCompressionQuality(stats) {
    const { channels } = stats;
    let quality = 1.0;
    
    for (const channel of channels) {
      const variance = channel.variance;
      
      if (variance < 100) quality -= 0.1;
      if (variance < 50) quality -= 0.2;
    }
    
    return Math.max(0, quality);
  }

  estimateCompressionLevel(stats) {
    const quality = this.calculateCompressionQuality(stats);
    
    if (quality > 0.9) return 'high';
    if (quality > 0.7) return 'medium';
    return 'low';
  }

  calculateNoiseUniformity(stats) {
    const { channels } = stats;
    let uniformity = 1.0;
    
    for (const channel of channels) {
      const variance = channel.variance;
      const mean = channel.mean;
      
      if (variance < 10 || variance > 10000) uniformity -= 0.2;
      if (mean < 10 || mean > 245) uniformity -= 0.1;
    }
    
    return Math.max(0, uniformity);
  }

  analyzeNoisePattern(stats) {
    const uniformity = this.calculateNoiseUniformity(stats);
    
    if (uniformity > 0.8) return 'natural';
    if (uniformity > 0.6) return 'suspicious';
    return 'artificial';
  }

  detectAIGeneratedArtifacts(stats) {
    const { channels } = stats;
    
    for (const channel of channels) {
      const variance = channel.variance;
      const mean = channel.mean;
      
      if (variance < 5 && mean > 120) return true;
      if (variance > 5000 && mean < 50) return true;
    }
    
    return false;
  }

  detectManipulationArtifacts(stats) {
    const { channels } = stats;
    
    for (const channel of channels) {
      const variance = channel.variance;
      const mean = channel.mean;
      
      if (variance === 0) return true;
      if (mean === 0 || mean === 255) return true;
    }
    
    return false;
  }
}

// Road Damage Detection
class RoadDamageDetector {
  constructor() {
    this.model = null;
    this.isLoaded = false;
  }

  async loadModel() {
    try {
      console.log('Road Damage Detection Model initialized (rule-based fallback)');
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load road damage model:', error);
      this.isLoaded = false;
    }
  }

  async detectRoadDamage(imageBuffer) {
    try {
      if (this.isLoaded) {
        return await this.ruleBasedDamageDetection(imageBuffer);
      } else {
        return await this.basicDamageDetection(imageBuffer);
      }
    } catch (error) {
      console.error('Road damage detection failed:', error);
      return {
        hasDamage: false,
        damageType: 'unknown',
        severity: 0,
        confidence: 0,
        location: { x: 0, y: 0, width: 0, height: 0 }
      };
    }
  }

  async ruleBasedDamageDetection(imageBuffer) {
    const image = sharp(imageBuffer);
    const stats = await image.stats();
    
    // Edge detection for damage
    const edges = await image
      .greyscale()
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
      })
      .toBuffer();

    const edgeStats = await sharp(edges).stats();
    const edgeIntensity = edgeStats.channels[0].mean;
    
    const hasDamage = edgeIntensity > 50;
    const severity = Math.min(10, Math.max(1, edgeIntensity / 10));
    
    return {
      hasDamage,
      damageType: hasDamage ? 'pothole' : 'none',
      severity,
      confidence: hasDamage ? 0.7 : 0.9,
      location: { x: 0, y: 0, width: 512, height: 512 }
    };
  }

  async basicDamageDetection(imageBuffer) {
    const metadata = await sharp(imageBuffer).metadata();
    
    // Basic damage detection based on image characteristics
    const hasDamage = metadata.width > 100 && metadata.height > 100;
    
    return {
      hasDamage,
      damageType: hasDamage ? 'pothole' : 'none',
      severity: hasDamage ? 5 : 0,
      confidence: 0.6,
      location: { x: 0, y: 0, width: metadata.width || 0, height: metadata.height || 0 }
    };
  }
}

// Main AI Analysis Service
class AIAnalysisService {
  constructor() {
    this.authenticityDetector = new ImageAuthenticityDetector();
    this.damageDetector = new RoadDamageDetector();
  }

  async initialize() {
    await Promise.all([
      this.authenticityDetector.loadModel(),
      this.damageDetector.loadModel()
    ]);
  }

  async analyzeImages(image1, image2) {
    try {
      // Analyze both images for authenticity
      const [auth1, auth2] = await Promise.all([
        this.authenticityDetector.analyzeImage(image1),
        this.authenticityDetector.analyzeImage(image2)
      ]);

      // Analyze both images for road damage
      const [damage1, damage2] = await Promise.all([
        this.damageDetector.detectRoadDamage(image1),
        this.damageDetector.detectRoadDamage(image2)
      ]);

      // Determine overall authenticity
      const avgConfidence = (auth1.confidence + auth2.confidence) / 2;
      const isAuthentic = auth1.isAuthentic && auth2.isAuthentic && avgConfidence > 0.7;

      // Determine overall damage assessment
      const combinedDamage = this.combineDamageAnalysis(damage1, damage2);

      let reason;
      if (!isAuthentic) {
        if (auth1.analysis.aiGenerated || auth2.analysis.aiGenerated) {
          reason = 'Images appear to be AI-generated';
        } else if (auth1.analysis.manipulated || auth2.analysis.manipulated) {
          reason = 'Images appear to be manipulated';
        } else {
          reason = 'Images failed authenticity verification';
        }
      }

      return {
        isAuthentic,
        confidence: avgConfidence,
        reason,
        damageAnalysis: {
          image1: damage1,
          image2: damage2,
          combined: combinedDamage
        },
        authenticityAnalysis: {
          image1: auth1.analysis,
          image2: auth2.analysis
        }
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        isAuthentic: false,
        confidence: 0,
        reason: 'Analysis failed',
        damageAnalysis: {
          image1: null,
          image2: null,
          combined: null
        },
        authenticityAnalysis: {
          image1: null,
          image2: null
        }
      };
    }
  }

  combineDamageAnalysis(damage1, damage2) {
    if (!damage1.hasDamage && !damage2.hasDamage) {
      return {
        hasDamage: false,
        damageType: 'none',
        severity: 0,
        confidence: 0.9
      };
    }

    const hasDamage = damage1.hasDamage || damage2.hasDamage;
    const severity = Math.max(damage1.severity || 0, damage2.severity || 0);
    const confidence = (damage1.confidence + damage2.confidence) / 2;

    let damageType = 'other';
    if (damage1.hasDamage && damage2.hasDamage) {
      damageType = damage1.damageType === damage2.damageType ? damage1.damageType : 'mixed';
    } else if (damage1.hasDamage) {
      damageType = damage1.damageType;
    } else if (damage2.hasDamage) {
      damageType = damage2.damageType;
    }

    return {
      hasDamage,
      damageType,
      severity,
      confidence
    };
  }
}

module.exports = AIAnalysisService; 