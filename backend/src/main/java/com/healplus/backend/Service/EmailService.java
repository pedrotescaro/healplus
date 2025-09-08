package com.healplus.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from:noreply@healplus.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public void sendEmailVerification(String to, String token) {
        String subject = "Verificação de Email - Heal+";
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        
        String body = String.format("""
            Olá,
            
            Obrigado por se cadastrar no Heal+!
            
            Para ativar sua conta, clique no link abaixo:
            %s
            
            Este link expira em 24 horas.
            
            Se você não se cadastrou no Heal+, ignore este email.
            
            Atenciosamente,
            Equipe Heal+
            """, verificationUrl);

        sendEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Redefinição de Senha - Heal+";
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        
        String body = String.format("""
            Olá,
            
            Você solicitou a redefinição de sua senha no Heal+.
            
            Para redefinir sua senha, clique no link abaixo:
            %s
            
            Este link expira em 1 hora.
            
            Se você não solicitou esta redefinição, ignore este email.
            
            Atenciosamente,
            Equipe Heal+
            """, resetUrl);

        sendEmail(to, subject, body);
    }

    public void sendWelcomeEmail(String to, String firstName) {
        String subject = "Bem-vindo ao Heal+!";
        
        String body = String.format("""
            Olá %s,
            
            Bem-vindo ao Heal+! Sua conta foi ativada com sucesso.
            
            Agora você pode:
            - Acessar seu painel de controle
            - Agendar consultas
            - Acompanhar seu progresso
            - Usar nosso assistente de IA
            
            Se você tiver alguma dúvida, não hesite em entrar em contato conosco.
            
            Atenciosamente,
            Equipe Heal+
            """, firstName);

        sendEmail(to, subject, body);
    }

    public void sendAppointmentReminder(String to, String patientName, String appointmentDate, String appointmentTime) {
        String subject = "Lembrete de Consulta - Heal+";
        
        String body = String.format("""
            Olá %s,
            
            Este é um lembrete de que você tem uma consulta agendada:
            
            Data: %s
            Horário: %s
            
            Por favor, confirme sua presença ou reagende se necessário.
            
            Atenciosamente,
            Equipe Heal+
            """, patientName, appointmentDate, appointmentTime);

        sendEmail(to, subject, body);
    }

    public void sendAssessmentReminder(String to, String patientName) {
        String subject = "Lembrete de Avaliação - Heal+";
        
        String body = String.format("""
            Olá %s,
            
            É hora de fazer uma nova avaliação da sua ferida.
            
            Por favor, acesse o aplicativo e:
            1. Tire uma foto da ferida
            2. Responda às perguntas de avaliação
            3. Envie para seu médico
            
            Sua avaliação regular é importante para o acompanhamento do tratamento.
            
            Atenciosamente,
            Equipe Heal+
            """, patientName);

        sendEmail(to, subject, body);
    }

    public void sendDataProcessingNotification(String to, String patientName) {
        String subject = "Atualização da Política de Privacidade - Heal+";
        
        String body = String.format("""
            Olá %s,
            
            Atualizamos nossa Política de Privacidade em conformidade com a LGPD.
            
            Por favor, revise as mudanças e atualize seu consentimento:
            %s/privacy-policy
            
            Seus dados continuam seguros e protegidos.
            
            Atenciosamente,
            Equipe Heal+
            """, patientName, frontendUrl);

        sendEmail(to, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            System.out.println("Email enviado para: " + to);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email para " + to + ": " + e.getMessage());
            // In production, you might want to log this to a proper logging system
        }
    }
}
