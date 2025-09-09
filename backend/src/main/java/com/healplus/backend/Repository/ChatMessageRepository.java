package com.healplus.backend.Repository;

import com.healplus.backend.Model.ChatMessage;
import com.healplus.backend.Model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    List<ChatMessage> findByChatSession(ChatSession chatSession);
    
    List<ChatMessage> findByChatSessionOrderBySentAtAsc(ChatSession chatSession);
    
    List<ChatMessage> findByChatSessionOrderBySentAtDesc(ChatSession chatSession);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session AND cm.senderType = :senderType")
    List<ChatMessage> findByChatSessionAndSenderType(@Param("session") ChatSession chatSession, 
                                                    @Param("senderType") ChatMessage.SenderType senderType);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.messageType = :messageType")
    List<ChatMessage> findByMessageType(@Param("messageType") ChatMessage.MessageType messageType);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.senderType = :senderType")
    List<ChatMessage> findBySenderType(@Param("senderType") ChatMessage.SenderType senderType);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.sentAt >= :startDate AND cm.sentAt <= :endDate")
    List<ChatMessage> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.isProcessed = :processed")
    List<ChatMessage> findByProcessedStatus(@Param("processed") Boolean processed);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.confidenceScore >= :minConfidence")
    List<ChatMessage> findByMinConfidence(@Param("minConfidence") Double minConfidence);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.confidenceScore < :maxConfidence")
    List<ChatMessage> findByMaxConfidence(@Param("maxConfidence") Double maxConfidence);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.requiresHumanReview = true")
    List<ChatMessage> findMessagesRequiringHumanReview();
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.isEscalated = true")
    List<ChatMessage> findEscalatedMessages();
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.isEdited = true")
    List<ChatMessage> findEditedMessages();
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.isDeleted = true")
    List<ChatMessage> findDeletedMessages();
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.language = :language")
    List<ChatMessage> findByLanguage(@Param("language") String language);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.processingTimeMs <= :maxProcessingTime")
    List<ChatMessage> findByMaxProcessingTime(@Param("maxProcessingTime") Integer maxProcessingTime);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session AND cm.senderType = 'USER' ORDER BY cm.sentAt DESC")
    List<ChatMessage> findUserMessagesBySession(@Param("session") ChatSession chatSession);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session AND cm.senderType = 'BOT' ORDER BY cm.sentAt DESC")
    List<ChatMessage> findBotMessagesBySession(@Param("session") ChatSession chatSession);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session AND cm.senderType = 'HUMAN_AGENT' ORDER BY cm.sentAt DESC")
    List<ChatMessage> findHumanAgentMessagesBySession(@Param("session") ChatSession chatSession);
    
    @Query("SELECT AVG(cm.confidenceScore) FROM ChatMessage cm WHERE cm.confidenceScore IS NOT NULL")
    Double getAverageConfidenceScore();
    
    @Query("SELECT AVG(cm.processingTimeMs) FROM ChatMessage cm WHERE cm.processingTimeMs IS NOT NULL")
    Double getAverageProcessingTime();
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.senderType = :senderType AND cm.sentAt >= :startDate AND cm.sentAt <= :endDate")
    Long countMessagesBySenderTypeAndDateRange(@Param("senderType") ChatMessage.SenderType senderType,
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session ORDER BY cm.sentAt DESC LIMIT 1")
    Optional<ChatMessage> findLatestMessageBySession(@Param("session") ChatSession chatSession);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session AND cm.senderType = 'USER' ORDER BY cm.sentAt DESC LIMIT 1")
    Optional<ChatMessage> findLatestUserMessageBySession(@Param("session") ChatSession chatSession);
}
