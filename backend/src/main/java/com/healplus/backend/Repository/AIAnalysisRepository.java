package com.healplus.backend.Repository;

import com.healplus.backend.Model.AIAnalysis;
import com.healplus.backend.Model.WoundAssessment;
import com.healplus.backend.Model.WoundImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, UUID> {
    
    List<AIAnalysis> findByWoundAssessment(WoundAssessment woundAssessment);
    
    List<AIAnalysis> findByWoundImage(WoundImage woundImage);
    
    List<AIAnalysis> findByAnalysisType(AIAnalysis.AnalysisType analysisType);
    
    List<AIAnalysis> findByModelType(AIAnalysis.ModelType modelType);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.analysisDate >= :startDate AND ai.analysisDate <= :endDate")
    List<AIAnalysis> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.predictedInfectionRisk = :riskLevel")
    List<AIAnalysis> findByPredictedInfectionRisk(@Param("riskLevel") AIAnalysis.InfectionRiskLevel riskLevel);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.predictedHealingTrajectory = :trajectory")
    List<AIAnalysis> findByPredictedHealingTrajectory(@Param("trajectory") AIAnalysis.HealingTrajectory trajectory);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.overallConfidence >= :minConfidence")
    List<AIAnalysis> findByMinConfidence(@Param("minConfidence") Double minConfidence);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.overallConfidence < :maxConfidence")
    List<AIAnalysis> findByMaxConfidence(@Param("maxConfidence") Double maxConfidence);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.isReviewed = false")
    List<AIAnalysis> findUnreviewedAnalyses();
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.isApproved = true")
    List<AIAnalysis> findApprovedAnalyses();
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.isApproved = false AND ai.isReviewed = true")
    List<AIAnalysis> findRejectedAnalyses();
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.woundAssessment = :assessment ORDER BY ai.analysisDate DESC")
    List<AIAnalysis> findByWoundAssessmentOrderByDate(@Param("assessment") WoundAssessment assessment);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.woundAssessment = :assessment AND ai.analysisType = :type ORDER BY ai.analysisDate DESC")
    List<AIAnalysis> findByWoundAssessmentAndType(@Param("assessment") WoundAssessment assessment, 
                                                  @Param("type") AIAnalysis.AnalysisType type);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.modelVersion = :version")
    List<AIAnalysis> findByModelVersion(@Param("version") String version);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.processingTimeMs <= :maxProcessingTime")
    List<AIAnalysis> findByMaxProcessingTime(@Param("maxProcessingTime") Double maxProcessingTime);
    
    @Query("SELECT AVG(ai.overallConfidence) FROM AIAnalysis ai WHERE ai.overallConfidence IS NOT NULL")
    Double getAverageConfidence();
    
    @Query("SELECT AVG(ai.processingTimeMs) FROM AIAnalysis ai WHERE ai.processingTimeMs IS NOT NULL")
    Double getAverageProcessingTime();
    
    @Query("SELECT AVG(ai.infectionRiskScore) FROM AIAnalysis ai WHERE ai.infectionRiskScore IS NOT NULL")
    Double getAverageInfectionRiskScore();
    
    @Query("SELECT AVG(ai.healingProbability) FROM AIAnalysis ai WHERE ai.healingProbability IS NOT NULL")
    Double getAverageHealingProbability();
    
    @Query("SELECT COUNT(ai) FROM AIAnalysis ai WHERE ai.analysisType = :type AND ai.analysisDate >= :startDate AND ai.analysisDate <= :endDate")
    Long countAnalysesByTypeAndDateRange(@Param("type") AIAnalysis.AnalysisType type,
                                        @Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.woundAssessment = :assessment AND ai.analysisType = :type ORDER BY ai.analysisDate DESC LIMIT 1")
    Optional<AIAnalysis> findLatestAnalysisByAssessmentAndType(@Param("assessment") WoundAssessment assessment, 
                                                              @Param("type") AIAnalysis.AnalysisType type);
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.needsAdvancedTherapy = true")
    List<AIAnalysis> findAnalysesRecommendingAdvancedTherapy();
    
    @Query("SELECT ai FROM AIAnalysis ai WHERE ai.needsSpecialistReferral = true")
    List<AIAnalysis> findAnalysesRecommendingSpecialistReferral();
}
