package com.healplus.backend.Model.Entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_session_id", nullable = false)
    private ChatSession chatSession;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType messageType = MessageType.TEXT;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SenderType senderType = SenderType.USER;
    
    @Column(nullable = false, length = 4000)
    private String content; // Conteúdo da mensagem
    
    @Column(length = 1000)
    private String metadata; // Metadados adicionais (JSON)
    
    @Column
    private Boolean isProcessed = false; // Se foi processada pela IA
    
    @Column
    private Double confidenceScore; // Score de confiança da IA (0-1)
    
    @Column(length = 1000)
    private String intent; // Intenção detectada
    
    @Column(length = 1000)
    private String entities; // Entidades extraídas (JSON)
    
    @Column(length = 1000)
    private String response; // Resposta gerada
    
    @Column
    private Boolean requiresHumanReview = false; // Se requer revisão humana
    
    @Column
    private Boolean isEscalated = false; // Se foi escalada
    
    @Column
    private LocalDateTime escalatedAt; // Quando foi escalada
    
    @Column(length = 500)
    private String escalationReason; // Motivo da escalação
    
    @Column
    private Integer processingTimeMs; // Tempo de processamento em ms
    
    @Column
    private String language; // Idioma da mensagem
    
    @Column
    private Boolean isEdited = false; // Se foi editada
    
    @Column
    private LocalDateTime editedAt; // Quando foi editada
    
    @Column(length = 1000)
    private String editReason; // Motivo da edição
    
    @Column
    private Boolean isDeleted = false; // Se foi deletada
    
    @Column
    private LocalDateTime deletedAt; // Quando foi deletada
    
    @Column(length = 500)
    private String deleteReason; // Motivo da deleção
    
    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime readAt; // Quando foi lida
    
    @Column
    private LocalDateTime repliedAt; // Quando foi respondida
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum MessageType {
        TEXT, IMAGE, AUDIO, VIDEO, FILE, LOCATION, 
        QUICK_REPLY, BUTTON, CAROUSEL, CARD
    }
    
    public enum SenderType {
        USER, BOT, HUMAN_AGENT, SYSTEM
    }
}
