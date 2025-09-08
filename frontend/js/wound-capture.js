// Wound Capture JavaScript
class WoundCapture {
    constructor() {
        this.currentStep = 1;
        this.cameraStream = null;
        this.capturedImage = null;
        this.analysisResults = null;
        this.calibrationData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStepDisplay();
    }

    setupEventListeners() {
        // Camera settings
        document.getElementById('flash-enabled').addEventListener('change', this.toggleFlash.bind(this));
        document.getElementById('stabilization-enabled').addEventListener('change', this.toggleStabilization.bind(this));
        document.getElementById('hdr-enabled').addEventListener('change', this.toggleHDR.bind(this));
    }

    // Step Navigation
    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.updateStepDisplay();
            this.handleStepChange();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.handleStepChange();
        }
    }

    updateStepDisplay() {
        // Update progress steps
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update step content
        document.querySelectorAll('.capture-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    handleStepChange() {
        switch (this.currentStep) {
            case 1:
                this.initPreparation();
                break;
            case 2:
                this.initCamera();
                break;
            case 3:
                this.startAnalysis();
                break;
            case 4:
                this.displayResults();
                break;
        }
    }

    // Step 1: Preparation
    initPreparation() {
        console.log('Initializing preparation step');
        // Setup calibration tools
        this.setupCalibrationTools();
    }

    setupCalibrationTools() {
        // Add ruler interaction
        document.querySelectorAll('.marking').forEach(marking => {
            marking.addEventListener('click', () => {
                this.selectCalibrationPoint(marking.dataset.cm);
            });
        });
    }

    selectCalibrationPoint(cm) {
        console.log(`Selected calibration point: ${cm}cm`);
        // Visual feedback
        document.querySelectorAll('.marking').forEach(m => m.classList.remove('selected'));
        document.querySelector(`[data-cm="${cm}"]`).classList.add('selected');
    }

    startCalibration() {
        console.log('Starting calibration process');
        // Simulate calibration
        setTimeout(() => {
            this.calibrationData = {
                referenceLength: 5, // cm
                pixelRatio: 50 // pixels per cm
            };
            alert('Calibração concluída! Agora você pode capturar a ferida.');
        }, 1000);
    }

    // Step 2: Camera
    async initCamera() {
        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment'
                }
            };

            this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            const video = document.getElementById('camera-preview');
            video.srcObject = this.cameraStream;

            // Setup distance detection
            this.setupDistanceDetection();

        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Erro ao acessar a câmera. Verifique as permissões.');
        }
    }

    setupDistanceDetection() {
        // Simulate distance detection
        const distanceText = document.getElementById('distance-text');
        const distances = ['15-20cm', '12-15cm', '10-12cm', '8-10cm', 'Muito próximo'];
        let currentIndex = 0;

        setInterval(() => {
            distanceText.textContent = distances[currentIndex];
            currentIndex = (currentIndex + 1) % distances.length;
        }, 2000);
    }

    captureImage() {
        const video = document.getElementById('camera-preview');
        const canvas = document.getElementById('capture-canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        canvas.toBlob((blob) => {
            this.capturedImage = blob;
            this.stopCamera();
            this.nextStep();
        }, 'image/jpeg', 0.9);
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }

    switchCamera() {
        // Toggle between front and back camera
        console.log('Switching camera');
        // Implementation would depend on device capabilities
    }

    // Step 3: AI Analysis
    async startAnalysis() {
        console.log('Starting AI analysis');
        
        const analysisSteps = [
            { id: 'step-segmentation', text: 'Segmentando ferida...', duration: 2000 },
            { id: 'step-tissue', text: 'Classificando tecidos...', duration: 3000 },
            { id: 'step-measurement', text: 'Calculando medições...', duration: 1500 },
            { id: 'step-risk', text: 'Avaliando riscos...', duration: 2000 }
        ];

        let totalDuration = 0;
        let currentProgress = 0;

        for (const step of analysisSteps) {
            await this.runAnalysisStep(step, currentProgress, totalDuration);
            currentProgress += step.duration;
        }

        // Complete analysis
        this.completeAnalysis();
    }

    async runAnalysisStep(step, currentProgress, totalDuration) {
        return new Promise((resolve) => {
            // Activate step
            document.getElementById(step.id).classList.add('active');
            
            // Update progress
            const progressBar = document.getElementById('analysis-progress');
            const progressText = document.getElementById('analysis-text');
            
            const updateProgress = () => {
                const progress = (currentProgress / totalDuration) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = step.text;
            };

            updateProgress();

            setTimeout(() => {
                // Complete step
                document.getElementById(step.id).classList.remove('active');
                document.getElementById(step.id).classList.add('completed');
                resolve();
            }, step.duration);
        });
    }

    completeAnalysis() {
        // Generate mock analysis results
        this.analysisResults = {
            measurements: {
                area: (Math.random() * 10 + 2).toFixed(2),
                perimeter: (Math.random() * 15 + 5).toFixed(2),
                width: (Math.random() * 4 + 1).toFixed(2),
                length: (Math.random() * 6 + 2).toFixed(2)
            },
            tissueAnalysis: {
                granulation: Math.floor(Math.random() * 40 + 30),
                slough: Math.floor(Math.random() * 30 + 10),
                necrosis: Math.floor(Math.random() * 20 + 5),
                epithelial: Math.floor(Math.random() * 25 + 10)
            },
            riskAssessment: {
                infectionRisk: ['Baixo', 'Médio', 'Alto'][Math.floor(Math.random() * 3)],
                healingProgress: ['Excelente', 'Bom', 'Regular', 'Lento'][Math.floor(Math.random() * 4)],
                recommendation: 'Continue com o tratamento atual e monitore sinais de infecção.'
            }
        };

        // Complete progress
        document.getElementById('analysis-progress').style.width = '100%';
        document.getElementById('analysis-text').textContent = 'Análise concluída!';

        setTimeout(() => {
            this.nextStep();
        }, 1000);
    }

    // Step 4: Results
    displayResults() {
        if (!this.analysisResults) return;

        // Display analyzed image
        const analyzedImage = document.getElementById('analyzed-image');
        const imageUrl = URL.createObjectURL(this.capturedImage);
        analyzedImage.src = imageUrl;

        // Display measurements
        const measurements = this.analysisResults.measurements;
        document.getElementById('area-value').textContent = `${measurements.area} cm²`;
        document.getElementById('perimeter-value').textContent = `${measurements.perimeter} cm`;
        document.getElementById('width-value').textContent = `${measurements.width} cm`;
        document.getElementById('length-value').textContent = `${measurements.length} cm`;

        // Display tissue analysis
        const tissue = this.analysisResults.tissueAnalysis;
        document.getElementById('granulation-percent').textContent = `${tissue.granulation}%`;
        document.getElementById('slough-percent').textContent = `${tissue.slough}%`;
        document.getElementById('necrosis-percent').textContent = `${tissue.necrosis}%`;
        document.getElementById('epithelial-percent').textContent = `${tissue.epithelial}%`;

        // Display risk assessment
        const risk = this.analysisResults.riskAssessment;
        document.getElementById('infection-risk').textContent = risk.infectionRisk;
        document.getElementById('infection-risk').className = `risk-level ${risk.infectionRisk.toLowerCase()}`;
        document.getElementById('healing-progress').textContent = risk.healingProgress;
        document.getElementById('recommendation').textContent = risk.recommendation;

        // Setup overlay controls
        this.setupOverlayControls();
    }

    setupOverlayControls() {
        // Initialize overlay canvas
        const canvas = document.getElementById('overlay-canvas');
        const ctx = canvas.getContext('2d');
        const img = document.getElementById('analyzed-image');

        img.onload = () => {
            canvas.width = img.offsetWidth;
            canvas.height = img.offsetHeight;
            this.drawOverlay(ctx, 'segmentation');
        };
    }

    drawOverlay(ctx, type) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        switch (type) {
            case 'segmentation':
                this.drawSegmentationOverlay(ctx);
                break;
            case 'tissue':
                this.drawTissueOverlay(ctx);
                break;
            case 'measurements':
                this.drawMeasurementsOverlay(ctx);
                break;
        }
    }

    drawSegmentationOverlay(ctx) {
        // Draw wound contour
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(ctx.canvas.width/2, ctx.canvas.height/2, 100, 80, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawTissueOverlay(ctx) {
        // Draw tissue regions
        const centerX = ctx.canvas.width/2;
        const centerY = ctx.canvas.height/2;

        // Granulation (green)
        ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 80, 60, 0, 0, Math.PI);
        ctx.fill();

        // Slough (orange)
        ctx.fillStyle = 'rgba(255, 152, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 80, 60, 0, Math.PI, 2 * Math.PI);
        ctx.fill();
    }

    drawMeasurementsOverlay(ctx) {
        const centerX = ctx.canvas.width/2;
        const centerY = ctx.canvas.height/2;

        // Draw measurement lines
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // Width line
        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY);
        ctx.lineTo(centerX + 100, centerY);
        ctx.stroke();

        // Length line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 80);
        ctx.lineTo(centerX, centerY + 80);
        ctx.stroke();

        ctx.setLineDash([]);
    }

    // Overlay Controls
    toggleOverlay(type) {
        const canvas = document.getElementById('overlay-canvas');
        const ctx = canvas.getContext('2d');
        this.drawOverlay(ctx, type);

        // Update button states
        document.querySelectorAll('.image-controls .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    // Actions
    retakePhoto() {
        this.currentStep = 2;
        this.updateStepDisplay();
        this.initCamera();
    }

    async saveResults() {
        try {
            const results = {
                image: this.capturedImage,
                analysis: this.analysisResults,
                timestamp: new Date().toISOString(),
                calibration: this.calibrationData
            };

            // Send to backend
            const response = await fetch('/api/wound-assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(results)
            });

            if (response.ok) {
                alert('Análise salva com sucesso!');
            } else {
                throw new Error('Erro ao salvar análise');
            }
        } catch (error) {
            console.error('Error saving results:', error);
            alert('Erro ao salvar análise. Tente novamente.');
        }
    }

    scheduleFollowUp() {
        // Open scheduling modal or redirect
        window.location.href = 'index.html#schedule';
    }

    // Camera Settings
    toggleFlash() {
        console.log('Flash toggled');
        // Implementation would depend on device capabilities
    }

    toggleStabilization() {
        console.log('Stabilization toggled');
        // Implementation would depend on device capabilities
    }

    toggleHDR() {
        console.log('HDR toggled');
        // Implementation would depend on device capabilities
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.woundCapture = new WoundCapture();
});

// Global functions for HTML onclick events
function nextStep() {
    window.woundCapture.nextStep();
}

function previousStep() {
    window.woundCapture.previousStep();
}

function startCalibration() {
    window.woundCapture.startCalibration();
}

function captureImage() {
    window.woundCapture.captureImage();
}

function switchCamera() {
    window.woundCapture.switchCamera();
}

function toggleOverlay(type) {
    window.woundCapture.toggleOverlay(type);
}

function retakePhoto() {
    window.woundCapture.retakePhoto();
}

function saveResults() {
    window.woundCapture.saveResults();
}

function scheduleFollowUp() {
    window.woundCapture.scheduleFollowUp();
}
