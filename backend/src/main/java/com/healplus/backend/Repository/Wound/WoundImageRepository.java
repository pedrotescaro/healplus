package com.healplus.backend.Repository.Wound;

import com.healplus.backend.Model.Entity.WoundImage;
import com.healplus.backend.Model.Entity.WoundAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WoundImageRepository extends JpaRepository<WoundImage, UUID> {
    
    List<WoundImage> findByWoundAssessment(WoundAssessment woundAssessment);
    
    List<WoundImage> findByWoundAssessmentOrderByCapturedAtDesc(WoundAssessment woundAssessment);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.isProcessed = :processed")
    List<WoundImage> findByProcessedStatus(@Param("processed") Boolean processed);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.processingConfidence >= :minConfidence")
    List<WoundImage> findByMinProcessingConfidence(@Param("minConfidence") Double minConfidence);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.processingConfidence < :maxConfidence")
    List<WoundImage> findByMaxProcessingConfidence(@Param("maxConfidence") Double maxConfidence);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.capturedAt >= :startDate AND wi.capturedAt <= :endDate")
    List<WoundImage> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.fileType = :fileType")
    List<WoundImage> findByFileType(@Param("fileType") String fileType);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.fileSize >= :minSize")
    List<WoundImage> findByMinFileSize(@Param("minSize") Long minSize);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.fileSize <= :maxSize")
    List<WoundImage> findByMaxFileSize(@Param("maxSize") Long maxSize);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.width >= :minWidth AND wi.height >= :minHeight")
    List<WoundImage> findByMinDimensions(@Param("minWidth") Integer minWidth, 
                                        @Param("minHeight") Integer minHeight);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.dpi >= :minDpi")
    List<WoundImage> findByMinDpi(@Param("minDpi") Double minDpi);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.processedAt IS NOT NULL")
    List<WoundImage> findProcessedImages();
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.processedAt IS NULL AND wi.isProcessed = false")
    List<WoundImage> findUnprocessedImages();
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.woundAssessment = :assessment AND wi.capturedAt = (SELECT MAX(wi2.capturedAt) FROM WoundImage wi2 WHERE wi2.woundAssessment = :assessment)")
    Optional<WoundImage> findLatestImageByAssessment(@Param("assessment") WoundAssessment assessment);
    
    @Query("SELECT AVG(wi.processingConfidence) FROM WoundImage wi WHERE wi.processingConfidence IS NOT NULL")
    Double getAverageProcessingConfidence();
    
    @Query("SELECT AVG(wi.fileSize) FROM WoundImage wi WHERE wi.fileSize IS NOT NULL")
    Double getAverageFileSize();
    
    @Query("SELECT COUNT(wi) FROM WoundImage wi WHERE wi.isProcessed = true AND wi.capturedAt >= :startDate AND wi.capturedAt <= :endDate")
    Long countProcessedImagesByDateRange(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT wi FROM WoundImage wi WHERE wi.woundAssessment = :assessment ORDER BY wi.capturedAt ASC")
    List<WoundImage> findImagesByAssessmentOrderByDate(@Param("assessment") WoundAssessment assessment);
}
