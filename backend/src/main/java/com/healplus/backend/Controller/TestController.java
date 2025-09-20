package com.healplus.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller de teste para verificar se a aplicação está funcionando
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello from HealPlus API!");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "OK");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "HealPlus Backend");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "HealPlus");
        response.put("description", "Sistema de monitoramento de feridas");
        response.put("version", "1.0.0");
        response.put("environment", "development");
        response.put("database", "H2");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
}
