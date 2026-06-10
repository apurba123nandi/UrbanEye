import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';

// AI Model for Image Authenticity Detection
class ImageAuthenticityDetector {
  private model: tf.LayersModel | null = null;
  private isLoaded = false;

  async loadModel() {
    try {
      // Load pre-trained model for image authenticity detection
      // This would be a model trained on real vs fake/AI-generated images
      this.model = await tf.loadLayersModel('https://your-model-url/model.json');
      this.isLoaded = true;
      console.log('AI Image Authenticity Model loaded successfully');
    } catch (error) {
      console.error('Failed to load AI model:', error);
      // Fallback to rule-based detection
      this.isLoaded = false;
    }
  }

  async analyzeImage(imageBuffer: Buffer): Promise<{
    isAuthentic: boolean;
    confidence: number;
    analysis: {
      metadata: any;
      compression: any;
      noise: any;
      artifacts: any;
      aiGenerated: boolean;
      manipulated: boolean;
    };
  }> {
    try {
      // Preprocess image
      const processedImage = await this.preprocessImage(imageBuffer);
      
      if (this.isLoaded && this.model) {
        // Use AI model for detection
        return await this.aiAnalysis(processedImage);
      } else {
        // Fallback to rule-based analysis
        return await this.ruleBasedAnalysis(processedImage);
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

  private async preprocessImage(imageBuffer: Buffer) {
    // Resize image to standard size for AI model
    const resizedImage = await sharp(imageBuffer)
      .resize(224, 224)
      .toBuffer();

    // Convert to tensor
    const tensor = tf.node.decodeImage(resizedImage, 3);
    const normalized = tensor.div(255.0);
    const batched = normalized.expandDims(0);
    
    return batched;
  }

  private async aiAnalysis(imageTensor: tf.Tensor): Promise<any> {
    const prediction = this.model!.predict(imageTensor) as tf.Tensor;
    const confidence = await prediction.data();
    
    imageTensor.dispose();
    prediction.dispose();

    return {
      isAuthentic: confidence[0] > 0.7,
      confidence: confidence[0],
      analysis: {
        metadata: await this.extractMetadata(imageTensor),
        compression: await this.analyzeCompression(imageTensor),
        noise: await this.analyzeNoise(imageTensor),
        artifacts: await this.analyzeArtifacts(imageTensor),
        aiGenerated: confidence[0] < 0.3,
        manipulated: confidence[0] < 0.5
      }
    };
  }

  private async ruleBasedAnalysis(imageBuffer: Buffer): Promise<any> {
    const metadata = await this.extractMetadata(imageBuffer);
    const compression = await this.analyzeCompression(imageBuffer);
    const noise = await this.analyzeNoise(imageBuffer);
    const artifacts = await this.analyzeArtifacts(imageBuffer);

    // Rule-based scoring
    let score = 0.5;
    let reasons: string[] = [];

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

  private async extractMetadata(imageBuffer: Buffer) {
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

  private async analyzeCompression(imageBuffer: Buffer) {
    try {
      const image = sharp(imageBuffer);
      const stats = await image.stats();
      
      // Analyze compression quality
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

  private async analyzeNoise(imageBuffer: Buffer) {
    try {
      const image = sharp(imageBuffer);
      const stats = await image.stats();
      
      // Analyze noise patterns
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

  private async analyzeArtifacts(imageBuffer: Buffer) {
    try {
      const image = sharp(imageBuffer);
      const stats = await image.stats();
      
      // Detect AI generation artifacts
      const aiGenerated = this.detectAIGeneratedArtifacts(stats);
      
      // Detect manipulation artifacts
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

  private calculateCompressionQuality(stats: any): number {
    // Calculate compression quality based on image statistics
    const { channels } = stats;
    let quality = 1.0;
    
    for (const channel of channels) {
      const variance = channel.variance;
      const mean = channel.mean;
      
      // Low variance might indicate compression artifacts
      if (variance < 100) quality -= 0.1;
      if (variance < 50) quality -= 0.2;
    }
    
    return Math.max(0, quality);
  }

  private estimateCompressionLevel(stats: any): string {
    const quality = this.calculateCompressionQuality(stats);
    
    if (quality > 0.9) return 'high';
    if (quality > 0.7) return 'medium';
    return 'low';
  }

  private calculateNoiseUniformity(stats: any): number {
    // Calculate noise uniformity across channels
    const { channels } = stats;
    let uniformity = 1.0;
    
    for (const channel of channels) {
      const variance = channel.variance;
      const mean = channel.mean;
      
      // Check for unusual patterns
      if (variance < 10 || variance > 10000) uniformity -= 0.2;
      if (mean < 10 || mean > 245) uniformity -= 0.1;
    }
    
    return Math.max(0, uniformity);
  }

  private analyzeNoisePattern(stats: any): string {
    const uniformity = this.calculateNoiseUniformity(stats);
    
    if (uniformity > 0.8) return 'natural';
    if (uniformity > 0.6) return 'suspicious';
    return 'artificial';
  }

  private detectAIGeneratedArtifacts(stats: any): boolean {
    // Detect patterns commonly found in AI-generated images
    const { channels } = stats;
    
    for (const channel of channels) {
      const variance = channel.variance;
      const mean = channel.mean;
      
      // AI-generated images often have specific statistical patterns
      if (variance < 5 && mean > 120) return true;
      if (variance > 5000 && mean < 50) return true;
    }
    
    return false;
  }

  private detectManipulationArtifacts(stats: any): boolean {
    // Detect patterns indicating image manipulation
    const { channels } = stats;
    
    for (const channel of channels) {
      const variance = channel.variance;
      const mean = channel.mean;
      
      // Manipulated images often have statistical inconsistencies
      if (variance === 0) return true;
      if (mean === 0 || mean === 255) return true;
    }
    
    return false;
  }
}

// Road Damage Detection Model
class RoadDamageDetector {
  private model: tf.LayersModel | null = null;
  private isLoaded = false;

  async loadModel() {
    try {
      // Load pre-trained model for road damage detection
      this.model = await tf.loadLayersModel('https://your-road-damage-model-url/model.json');
      this.isLoaded = true;
      console.log('Road Damage Detection Model loaded successfully');
    } catch (error) {
      console.error('Failed to load road damage model:', error);
      this.isLoaded = false;
    }
  }

  async detectRoadDamage(imageBuffer: Buffer): Promise<{
    hasDamage: boolean;
    damageType: string;
    severity: number;
    confidence: number;
    location: { x: number; y: number; width: number; height: number };
  }> {
    try {
      const processedImage = await this.preprocessImage(imageBuffer);
      
      if (this.isLoaded && this.model) {
        return await this.aiDamageDetection(processedImage);
      } else {
        return await this.ruleBasedDamageDetection(processedImage);
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

  private async preprocessImage(imageBuffer: Buffer) {
    const resizedImage = await sharp(imageBuffer)
      .resize(512, 512)
      .toBuffer();

    const tensor = tf.node.decodeImage(resizedImage, 3);
    const normalized = tensor.div(255.0);
    const batched = normalized.expandDims(0);
    
    return batched;
  }

  private async aiDamageDetection(imageTensor: tf.Tensor): Promise<any> {
    const prediction = this.model!.predict(imageTensor) as tf.Tensor;
    const results = await prediction.data();
    
    imageTensor.dispose();
    prediction.dispose();

    // Parse AI model results
    const hasDamage = results[0] > 0.5;
    const damageType = this.getDamageType(results[1]);
    const severity = results[2];
    const confidence = results[3];

    return {
      hasDamage,
      damageType,
      severity: Math.min(10, Math.max(1, severity * 10)),
      confidence,
      location: {
        x: results[4] * 512,
        y: results[5] * 512,
        width: results[6] * 512,
        height: results[7] * 512
      }
    };
  }

  private async ruleBasedDamageDetection(imageBuffer: Buffer): Promise<any> {
    // Rule-based road damage detection
    const image = sharp(imageBuffer);
    const stats = await image.stats();
    
    // Simple edge detection for damage
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

  private getDamageType(typeIndex: number): string {
    const types = ['pothole', 'crack', 'waterlogging', 'other'];
    const index = Math.floor(typeIndex * types.length);
    return types[Math.min(index, types.length - 1)];
  }
}

// Main AI Analysis Service
export class AIAnalysisService {
  private authenticityDetector: ImageAuthenticityDetector;
  private damageDetector: RoadDamageDetector;

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

  async analyzeImages(image1: Buffer, image2: Buffer): Promise<{
    isAuthentic: boolean;
    confidence: number;
    reason?: string;
    damageAnalysis: {
      image1: any;
      image2: any;
      combined: any;
    };
    authenticityAnalysis: {
      image1: any;
      image2: any;
    };
  }> {
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

      let reason: string | undefined;
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

  private combineDamageAnalysis(damage1: any, damage2: any) {
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

// Export singleton instance
export const aiAnalysisService = new AIAnalysisService(); 