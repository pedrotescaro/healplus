package com.healplus.backend.Controller.Patient;

import com.healplus.backend.Model.Entity.Patient;
import com.healplus.backend.mvp.presenter.PatientPresenter;
import com.healplus.backend.mvp.view.PatientControllerView;
import com.healplus.backend.security.annotation.RateLimited;
import com.healplus.backend.security.annotation.RequireRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controller MVP para gerenciar pacientes
 */
@RestController
@RequestMapping("/api/mvp/patients")
@CrossOrigin(origins = "*")
@RateLimited(requests = 200, windowMinutes = 60)
public class MvpPatientController {
    
    @Autowired
    private PatientPresenter patientPresenter;
    
    /**
     * Obter todos os pacientes
     */
    @GetMapping
    @RequireRole({"CLINICIAN", "ADMIN"})
    public ResponseEntity<?> getAllPatients() {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        patientPresenter.loadPatients();
        return view.getResponse();
    }
    
    /**
     * Obter paciente por ID
     */
    @GetMapping("/{id}")
    @RequireRole({"PATIENT", "CLINICIAN", "ADMIN"})
    public ResponseEntity<?> getPatientById(@PathVariable UUID id) {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        patientPresenter.loadPatient(id);
        return view.getResponse();
    }
    
    /**
     * Criar novo paciente
     */
    @PostMapping
    @RequireRole({"CLINICIAN", "ADMIN"})
    @RateLimited(requests = 50, windowMinutes = 60)
    public ResponseEntity<?> createPatient(@Valid @RequestBody Patient patient) {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        patientPresenter.createPatient(patient);
        return view.getResponse();
    }
    
    /**
     * Atualizar paciente
     */
    @PutMapping("/{id}")
    @RequireRole({"CLINICIAN", "ADMIN"})
    public ResponseEntity<?> updatePatient(@PathVariable UUID id, @Valid @RequestBody Patient patient) {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        patientPresenter.updatePatient(id, patient);
        return view.getResponse();
    }
    
    /**
     * Deletar paciente
     */
    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN"})
    @RateLimited(requests = 10, windowMinutes = 60)
    public ResponseEntity<?> deletePatient(@PathVariable UUID id) {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        patientPresenter.deletePatient(id);
        return view.getResponse();
    }
    
    /**
     * Buscar pacientes por nome
     */
    @GetMapping("/search")
    @RequireRole({"CLINICIAN", "ADMIN"})
    public ResponseEntity<?> searchPatientsByName(@RequestParam String name) {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        // Implementar busca no presenter
        view.showInfo("Busca por nome: " + name);
        return view.getResponse();
    }
    
    /**
     * Obter estatísticas de pacientes
     */
    @GetMapping("/statistics")
    @RequireRole({"CLINICIAN", "ADMIN"})
    public ResponseEntity<?> getPatientStatistics() {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        // Implementar estatísticas no presenter
        view.showInfo("Estatísticas de pacientes");
        return view.getResponse();
    }
}
