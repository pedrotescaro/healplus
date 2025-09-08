// AI Analysis JavaScript
class AIAnalysis {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.models = {
            segmentation: null,
            classification: null,
            prediction: null
        };
        this.init();
    }

    init() {
        this.loadModels();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for analysis requests
        window.addEventListener('analysisRequest', this.handleAnalysisRequest.bind(this));
    }

    async loadModels() {
        try {
            // Load AI models (in a real implementation, these would be loaded from a model server)
            console.log('Loading AI models...');
            
            // Simulate model loading
            await this.loadSegmentationModel();
            await this.loadClassificationModel();
            await this.loadPredictionModel();
            
            console.log('All models loaded successfully');
        } catch (error) {
            console.error('Error loading models:', error);
        }
    }

    async loadSegmentationModel() {
        // Simulate loading U-Net model for wound segmentation
        return new Promise((resolve) => {
            setTimeout(() => {
                this.models.segmentation = {
                    name: 'U-Net Wound Segmentation',
                    version: '1.0.0',
                    accuracy: 0.94
                };
                resolve();
            }, 1000);
        });
    }

    async loadClassificationModel() {
        // Simulate loading CNN model for tissue classification
        return new Promise((resolve) => {
            setTimeout(() => {
                this.models.classification = {
                    name: 'ResNet50 Tissue Classification',
                    version: '1.2.0',
                    accuracy: 0.89
                };
                resolve();
            }, 1000);
        });
    }

    async loadPredictionModel() {
        // Simulate loading Random Forest model for risk prediction
        return new Promise((resolve) => {
            setTimeout(() => {
                this.models.prediction = {
                    name: 'Random Forest Risk Prediction',
                    version: '2.0.0',
                    accuracy: 0.87
                };
                resolve();
            }, 1000);
        });
    }

    async analyzeWound(imageData, patientData = {}) {
        try {
            console.log('Starting wound analysis...');
            
            // Step 1: Image preprocessing
            const preprocessedImage = await this.preprocessImage(imageData);
            
            // Step 2: Wound segmentation
            const segmentationResult = await this.segmentWound(preprocessedImage);
            
            // Step 3: Tissue classification
            const tissueAnalysis = await this.classifyTissues(preprocessedImage, segmentationResult);
            
            // Step 4: Measurements
            const measurements = await this.calculateMeasurements(segmentationResult);
            
            // Step 5: Risk assessment
            const riskAssessment = await this.assessRisk(tissueAnalysis, measurements, patientData);
            
            // Step 6: Generate recommendations
            const recommendations = await this.generateRecommendations(tissueAnalysis, riskAssessment);
            
            // Step 7: Create XAI explanations
            const explanations = await this.generateExplanations(tissueAnalysis, riskAssessment);
            
            return {
                segmentation: segmentationResult,
                tissueAnalysis,
                measurements,
                riskAssessment,
                recommendations,
                explanations,
                timestamp: new Date().toISOString(),
                modelVersions: {
                    segmentation: this.models.segmentation.version,
                    classification: this.models.classification.version,
                    prediction: this.models.prediction.version
                }
            };
            
        } catch (error) {
            console.error('Error in wound analysis:', error);
            throw error;
        }
    }

    async preprocessImage(imageData) {
        console.log('Preprocessing image...');
        
        // Simulate image preprocessing
        return new Promise((resolve) => {
            setTimeout(() => {
                const preprocessed = {
                    originalSize: { width: 1280, height: 720 },
                    normalizedSize: { width: 512, height: 512 },
                    colorSpace: 'RGB',
                    contrast: 1.2,
                    brightness: 0.1,
                    sharpness: 1.1
                };
                resolve(preprocessed);
            }, 500);
        });
    }

    async segmentWound(imageData) {
        console.log('Segmenting wound...');
        
        // Simulate U-Net segmentation
        return new Promise((resolve) => {
            setTimeout(() => {
                const segmentation = {
                    woundMask: this.generateMockMask(),
                    confidence: 0.94,
                    boundingBox: { x: 100, y: 80, width: 200, height: 160 },
                    contour: this.generateMockContour(),
                    area: 31416, // pixels
                    perimeter: 628 // pixels
                };
                resolve(segmentation);
            }, 1500);
        });
    }

    async classifyTissues(imageData, segmentationResult) {
        console.log('Classifying tissues...');
        
        // Simulate CNN tissue classification
        return new Promise((resolve) => {
            setTimeout(() => {
                const tissueAnalysis = {
                    granulation: {
                        percentage: Math.floor(Math.random() * 40 + 30),
                        confidence: 0.89,
                        regions: this.generateMockRegions('granulation')
                    },
                    slough: {
                        percentage: Math.floor(Math.random() * 30 + 10),
                        confidence: 0.85,
                        regions: this.generateMockRegions('slough')
                    },
                    necrosis: {
                        percentage: Math.floor(Math.random() * 20 + 5),
                        confidence: 0.82,
                        regions: this.generateMockRegions('necrosis')
                    },
                    epithelial: {
                        percentage: Math.floor(Math.random() * 25 + 10),
                        confidence: 0.87,
                        regions: this.generateMockRegions('epithelial')
                    }
                };
                resolve(tissueAnalysis);
            }, 2000);
        });
    }

    async calculateMeasurements(segmentationResult) {
        console.log('Calculating measurements...');
        
        // Simulate measurement calculations
        return new Promise((resolve) => {
            setTimeout(() => {
                const measurements = {
                    area: {
                        pixels: segmentationResult.area,
                        cm2: (segmentationResult.area / 1000).toFixed(2), // Assuming 1000 pixels = 1 cm²
                        confidence: 0.95
                    },
                    perimeter: {
                        pixels: segmentationResult.perimeter,
                        cm: (segmentationResult.perimeter / 100).toFixed(2), // Assuming 100 pixels = 1 cm
                        confidence: 0.92
                    },
                    dimensions: {
                        width: {
                            pixels: 200,
                            cm: 2.0,
                            confidence: 0.90
                        },
                        length: {
                            pixels: 160,
                            cm: 1.6,
                            confidence: 0.90
                        }
                    },
                    depth: {
                        estimated: 'Superficial',
                        confidence: 0.75
                    }
                };
                resolve(measurements);
            }, 800);
        });
    }

    async assessRisk(tissueAnalysis, measurements, patientData) {
        console.log('Assessing risk...');
        
        // Simulate risk assessment using Random Forest
        return new Promise((resolve) => {
            setTimeout(() => {
                const riskFactors = this.calculateRiskFactors(tissueAnalysis, measurements, patientData);
                
                const riskAssessment = {
                    infectionRisk: {
                        level: this.calculateInfectionRisk(riskFactors),
                        score: Math.floor(Math.random() * 100),
                        factors: riskFactors.infection,
                        confidence: 0.87
                    },
                    healingProgress: {
                        status: this.calculateHealingProgress(tissueAnalysis),
                        timeline: this.estimateHealingTime(tissueAnalysis, measurements),
                        confidence: 0.82
                    },
                    complications: {
                        risk: this.assessComplicationRisk(riskFactors),
                        factors: riskFactors.complications,
                        confidence: 0.79
                    }
                };
                resolve(riskAssessment);
            }, 1200);
        });
    }

    async generateRecommendations(tissueAnalysis, riskAssessment) {
        console.log('Generating recommendations...');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const recommendations = {
                    treatment: this.generateTreatmentRecommendations(tissueAnalysis),
                    monitoring: this.generateMonitoringRecommendations(riskAssessment),
                    followUp: this.generateFollowUpRecommendations(riskAssessment),
                    alerts: this.generateAlerts(riskAssessment)
                };
                resolve(recommendations);
            }, 600);
        });
    }

    async generateExplanations(tissueAnalysis, riskAssessment) {
        console.log('Generating XAI explanations...');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const explanations = {
                    gradCAM: this.generateGradCAMExplanation(tissueAnalysis),
                    lime: this.generateLIMEExplanation(riskAssessment),
                    featureImportance: this.generateFeatureImportance(riskAssessment)
                };
                resolve(explanations);
            }, 800);
        });
    }

    // Helper methods for mock data generation
    generateMockMask() {
        // Generate a mock wound mask
        return {
            width: 512,
            height: 512,
            data: new Array(512 * 512).fill(0).map(() => Math.random() > 0.7 ? 1 : 0)
        };
    }

    generateMockContour() {
        // Generate mock contour points
        const points = [];
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * 2 * Math.PI;
            const radius = 100 + Math.random() * 20;
            points.push({
                x: 256 + radius * Math.cos(angle),
                y: 256 + radius * Math.sin(angle)
            });
        }
        return points;
    }

    generateMockRegions(tissueType) {
        // Generate mock tissue regions
        const regions = [];
        const numRegions = Math.floor(Math.random() * 5 + 2);
        
        for (let i = 0; i < numRegions; i++) {
            regions.push({
                id: `${tissueType}_${i}`,
                area: Math.floor(Math.random() * 1000 + 100),
                centroid: {
                    x: Math.floor(Math.random() * 400 + 50),
                    y: Math.floor(Math.random() * 400 + 50)
                },
                confidence: 0.8 + Math.random() * 0.2
            });
        }
        return regions;
    }

    calculateRiskFactors(tissueAnalysis, measurements, patientData) {
        const factors = {
            infection: [],
            complications: []
        };

        // Analyze tissue composition
        if (tissueAnalysis.necrosis.percentage > 30) {
            factors.infection.push({
                factor: 'Alto percentual de tecido necrótico',
                weight: 0.8,
                impact: 'Aumenta risco de infecção'
            });
        }

        if (tissueAnalysis.slough.percentage > 40) {
            factors.infection.push({
                factor: 'Presença significativa de esfacelo',
                weight: 0.6,
                impact: 'Pode indicar infecção'
            });
        }

        // Analyze wound size
        const area = parseFloat(measurements.area.cm2);
        if (area > 10) {
            factors.complications.push({
                factor: 'Ferida de grande tamanho',
                weight: 0.7,
                impact: 'Maior risco de complicações'
            });
        }

        // Analyze patient factors
        if (patientData.diabetes) {
            factors.infection.push({
                factor: 'Diabetes mellitus',
                weight: 0.9,
                impact: 'Aumenta significativamente o risco de infecção'
            });
        }

        return factors;
    }

    calculateInfectionRisk(riskFactors) {
        const totalWeight = riskFactors.infection.reduce((sum, factor) => sum + factor.weight, 0);
        
        if (totalWeight > 1.5) return 'Alto';
        if (totalWeight > 0.8) return 'Médio';
        return 'Baixo';
    }

    calculateHealingProgress(tissueAnalysis) {
        const granulationRatio = tissueAnalysis.granulation.percentage / 100;
        const necroticRatio = tissueAnalysis.necrosis.percentage / 100;
        
        if (granulationRatio > 0.6 && necroticRatio < 0.2) return 'Excelente';
        if (granulationRatio > 0.4 && necroticRatio < 0.3) return 'Bom';
        if (granulationRatio > 0.2 && necroticRatio < 0.4) return 'Regular';
        return 'Lento';
    }

    estimateHealingTime(tissueAnalysis, measurements) {
        const area = parseFloat(measurements.area.cm2);
        const granulationRatio = tissueAnalysis.granulation.percentage / 100;
        
        // Simple heuristic based on area and tissue composition
        let baseTime = area * 2; // weeks
        let modifier = 1;
        
        if (granulationRatio > 0.5) modifier *= 0.7;
        if (granulationRatio < 0.3) modifier *= 1.5;
        
        return Math.ceil(baseTime * modifier);
    }

    assessComplicationRisk(riskFactors) {
        const totalWeight = riskFactors.complications.reduce((sum, factor) => sum + factor.weight, 0);
        
        if (totalWeight > 1.0) return 'Alto';
        if (totalWeight > 0.5) return 'Médio';
        return 'Baixo';
    }

    generateTreatmentRecommendations(tissueAnalysis) {
        const recommendations = [];
        
        if (tissueAnalysis.necrosis.percentage > 20) {
            recommendations.push({
                type: 'Desbridamento',
                priority: 'Alta',
                description: 'Considere desbridamento do tecido necrótico',
                evidence: 'Baseado em diretrizes TIMERS'
            });
        }
        
        if (tissueAnalysis.slough.percentage > 30) {
            recommendations.push({
                type: 'Cobertura Absorvente',
                priority: 'Média',
                description: 'Use cobertura que absorva o exsudato',
                evidence: 'Baseado em análise de umidade'
            });
        }
        
        if (tissueAnalysis.granulation.percentage > 50) {
            recommendations.push({
                type: 'Proteção',
                priority: 'Média',
                description: 'Proteja o tecido de granulação',
                evidence: 'Baseado em análise de tecidos'
            });
        }
        
        return recommendations;
    }

    generateMonitoringRecommendations(riskAssessment) {
        const recommendations = [];
        
        if (riskAssessment.infectionRisk.level === 'Alto') {
            recommendations.push({
                type: 'Monitoramento Intensivo',
                frequency: 'Diário',
                description: 'Monitore sinais de infecção diariamente',
                parameters: ['Temperatura', 'Eritema', 'Edema', 'Dor']
            });
        }
        
        return recommendations;
    }

    generateFollowUpRecommendations(riskAssessment) {
        const recommendations = [];
        
        if (riskAssessment.healingProgress.status === 'Lento') {
            recommendations.push({
                type: 'Reavaliação',
                timeframe: '1 semana',
                description: 'Reavalie o plano de tratamento',
                reason: 'Progresso lento da cicatrização'
            });
        }
        
        return recommendations;
    }

    generateAlerts(riskAssessment) {
        const alerts = [];
        
        if (riskAssessment.infectionRisk.level === 'Alto') {
            alerts.push({
                type: 'warning',
                message: 'Alto risco de infecção detectado',
                action: 'Considere antibioticoterapia profilática'
            });
        }
        
        if (riskAssessment.complications.risk === 'Alto') {
            alerts.push({
                type: 'critical',
                message: 'Alto risco de complicações',
                action: 'Encaminhe para especialista'
            });
        }
        
        return alerts;
    }

    generateGradCAMExplanation(tissueAnalysis) {
        return {
            description: 'Mapa de calor mostrando as regiões mais importantes para a classificação',
            regions: [
                {
                    tissue: 'granulation',
                    importance: 0.85,
                    coordinates: { x: 200, y: 150, width: 100, height: 80 }
                },
                {
                    tissue: 'necrosis',
                    importance: 0.92,
                    coordinates: { x: 250, y: 200, width: 60, height: 50 }
                }
            ]
        };
    }

    generateLIMEExplanation(riskAssessment) {
        return {
            description: 'Explicação local dos fatores que contribuíram para a avaliação de risco',
            factors: [
                {
                    feature: 'Percentual de tecido necrótico',
                    contribution: 0.35,
                    impact: 'Aumenta risco de infecção'
                },
                {
                    feature: 'Área da ferida',
                    contribution: 0.28,
                    impact: 'Maior área = maior risco'
                },
                {
                    feature: 'Presença de diabetes',
                    contribution: 0.42,
                    impact: 'Fator de risco significativo'
                }
            ]
        };
    }

    generateFeatureImportance(riskAssessment) {
        return {
            description: 'Importância relativa de cada característica na predição',
            features: [
                { name: 'Tecido necrótico', importance: 0.25 },
                { name: 'Área da ferida', importance: 0.20 },
                { name: 'Comorbidades', importance: 0.30 },
                { name: 'Idade do paciente', importance: 0.15 },
                { name: 'Tipo de ferida', importance: 0.10 }
            ]
        };
    }

    handleAnalysisRequest(event) {
        const { imageData, patientData } = event.detail;
        this.analyzeWound(imageData, patientData)
            .then(results => {
                // Dispatch results event
                window.dispatchEvent(new CustomEvent('analysisComplete', {
                    detail: results
                }));
            })
            .catch(error => {
                window.dispatchEvent(new CustomEvent('analysisError', {
                    detail: { error }
                }));
            });
    }
}

// Initialize AI Analysis
document.addEventListener('DOMContentLoaded', () => {
    window.aiAnalysis = new AIAnalysis();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAnalysis;
}
