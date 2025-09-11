package com.healplus.backend.Service.Wound;

import com.healplus.backend.Model.Entity.WoundImage;
import com.healplus.backend.Model.Entity.WoundAssessment;
import com.healplus.backend.Repository.Wound.WoundImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ImageProcessingService {
    
    @Autowired
    private WoundImageRepository woundImageRepository;
    
    @Value("${healplus.images.upload.path:/uploads/images}")
    private String uploadPath;
    
    @Value("${healplus.images.max.size:10485760}") // 10MB
    private long maxFileSize;
    
    @Value("${healplus.images.allowed.types:image/jpeg,image/png,image/jpg}")
    private String[] allowedTypes;
    
    /**
     * Processar e salvar imagem de ferida
     */
    public WoundImage processAndSaveImage(WoundAssessment assessment, MultipartFile imageFile) {
        try {
            // Validar arquivo
            validateImageFile(imageFile);
            
            // Gerar nome único para o arquivo
            String originalFilename = imageFile.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = generateUniqueFilename(fileExtension);
            
            // Criar diretório se não existir
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            // Salvar arquivo original
            Path filePath = uploadDir.resolve(uniqueFilename);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Criar registro no banco
            WoundImage woundImage = new WoundImage();
            woundImage.setWoundAssessment(assessment);
            woundImage.setOriginalImagePath(filePath.toString());
            woundImage.setFileSize(imageFile.getSize());
            woundImage.setFileType(imageFile.getContentType());
            woundImage.setCapturedAt(LocalDateTime.now());
            woundImage.setCreatedAt(LocalDateTime.now());
            
            // Processar metadados da imagem
            processImageMetadata(woundImage, filePath);
            
            // Salvar no banco
            woundImage = woundImageRepository.save(woundImage);
            
            // Processar imagem assincronamente
            processImageAsync(woundImage);
            
            return woundImage;
            
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar imagem: " + e.getMessage(), e);
        }
    }
    
    /**
     * Validar arquivo de imagem
     */
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo de imagem é obrigatório");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("Arquivo muito grande. Tamanho máximo: " + 
                (maxFileSize / 1024 / 1024) + "MB");
        }
        
        String contentType = file.getContentType();
        boolean isValidType = false;
        for (String allowedType : allowedTypes) {
            if (allowedType.equals(contentType)) {
                isValidType = true;
                break;
            }
        }
        
        if (!isValidType) {
            throw new IllegalArgumentException("Tipo de arquivo não suportado. Tipos permitidos: " + 
                String.join(", ", allowedTypes));
        }
    }
    
    /**
     * Obter extensão do arquivo
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    /**
     * Gerar nome único para arquivo
     */
    private String generateUniqueFilename(String extension) {
        return UUID.randomUUID().toString() + extension;
    }
    
    /**
     * Processar metadados da imagem
     */
    private void processImageMetadata(WoundImage woundImage, Path filePath) {
        try {
            // Em uma implementação real, usar biblioteca como ImageIO ou metadata-extractor
            // Para simulação, definir valores padrão
            woundImage.setWidth(1920);
            woundImage.setHeight(1080);
            woundImage.setDpi(300.0);
            
            // Gerar caminho da miniatura
            String thumbnailPath = generateThumbnailPath(filePath.toString());
            woundImage.setThumbnailPath(thumbnailPath);
            
        } catch (Exception e) {
            // Log do erro, mas não falhar o processo
            System.err.println("Erro ao processar metadados: " + e.getMessage());
        }
    }
    
    /**
     * Gerar caminho da miniatura
     */
    private String generateThumbnailPath(String originalPath) {
        String filename = Paths.get(originalPath).getFileName().toString();
        String nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
        String extension = filename.substring(filename.lastIndexOf("."));
        return originalPath.replace(filename, nameWithoutExt + "_thumb" + extension);
    }
    
    /**
     * Processar imagem assincronamente
     */
    private void processImageAsync(WoundImage woundImage) {
        // Em uma implementação real, usar @Async ou fila de processamento
        // Para simulação, processar sincronamente
        try {
            // Simular processamento de segmentação
            String segmentedPath = generateSegmentedImagePath(woundImage.getOriginalImagePath());
            woundImage.setSegmentedImagePath(segmentedPath);
            
            // Simular geração de mapa de calor
            String heatmapPath = generateHeatmapPath(woundImage.getOriginalImagePath());
            woundImage.setHeatmapImagePath(heatmapPath);
            
            // Marcar como processada
            woundImage.setIsProcessed(true);
            woundImage.setProcessingConfidence(0.85); // Simular confiança
            woundImage.setProcessedAt(LocalDateTime.now());
            
            // Salvar atualizações
            woundImageRepository.save(woundImage);
            
        } catch (Exception e) {
            System.err.println("Erro no processamento assíncrono: " + e.getMessage());
        }
    }
    
    /**
     * Gerar caminho da imagem segmentada
     */
    private String generateSegmentedImagePath(String originalPath) {
        String filename = Paths.get(originalPath).getFileName().toString();
        String nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
        String extension = filename.substring(filename.lastIndexOf("."));
        return originalPath.replace(filename, nameWithoutExt + "_segmented" + extension);
    }
    
    /**
     * Gerar caminho do mapa de calor
     */
    private String generateHeatmapPath(String originalPath) {
        String filename = Paths.get(originalPath).getFileName().toString();
        String nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
        String extension = filename.substring(filename.lastIndexOf("."));
        return originalPath.replace(filename, nameWithoutExt + "_heatmap" + extension);
    }
    
    /**
     * Obter imagem por ID
     */
    public WoundImage getImageById(UUID id) {
        return woundImageRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Imagem não encontrada: " + id));
    }
    
    /**
     * Obter imagens por avaliação
     */
    public java.util.List<WoundImage> getImagesByAssessment(WoundAssessment assessment) {
        return woundImageRepository.findByWoundAssessment(assessment);
    }
    
    /**
     * Obter imagem mais recente por avaliação
     */
    public WoundImage getLatestImageByAssessment(WoundAssessment assessment) {
        return woundImageRepository.findLatestImageByAssessment(assessment)
            .orElseThrow(() -> new IllegalArgumentException("Nenhuma imagem encontrada para a avaliação"));
    }
    
    /**
     * Deletar imagem
     */
    public void deleteImage(UUID id) {
        WoundImage image = getImageById(id);
        
        try {
            // Deletar arquivos físicos
            deleteFileIfExists(image.getOriginalImagePath());
            deleteFileIfExists(image.getSegmentedImagePath());
            deleteFileIfExists(image.getHeatmapImagePath());
            deleteFileIfExists(image.getThumbnailPath());
            
            // Deletar do banco
            woundImageRepository.deleteById(id);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar imagem: " + e.getMessage(), e);
        }
    }
    
    /**
     * Deletar arquivo se existir
     */
    private void deleteFileIfExists(String filePath) {
        if (filePath != null) {
            try {
                Path path = Paths.get(filePath);
                if (Files.exists(path)) {
                    Files.delete(path);
                }
            } catch (IOException e) {
                System.err.println("Erro ao deletar arquivo " + filePath + ": " + e.getMessage());
            }
        }
    }
    
    /**
     * Validar qualidade da imagem
     */
    public boolean validateImageQuality(WoundImage image) {
        // Critérios de qualidade
        boolean hasMinResolution = image.getWidth() >= 800 && image.getHeight() >= 600;
        boolean hasMinDpi = image.getDpi() >= 150;
        boolean hasReasonableSize = image.getFileSize() >= 100000; // 100KB mínimo
        
        return hasMinResolution && hasMinDpi && hasReasonableSize;
    }
    
    /**
     * Gerar estatísticas de imagens
     */
    public java.util.Map<String, Object> getImageStatistics() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        
        long totalImages = woundImageRepository.count();
        long processedImages = woundImageRepository.findProcessedImages().size();
        long unprocessedImages = woundImageRepository.findUnprocessedImages().size();
        
        stats.put("totalImages", totalImages);
        stats.put("processedImages", processedImages);
        stats.put("unprocessedImages", unprocessedImages);
        stats.put("processingRate", totalImages > 0 ? (double) processedImages / totalImages : 0.0);
        
        return stats;
    }
}
