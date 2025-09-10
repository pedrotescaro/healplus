package com.healplus.backend.Controller.Patient;

import com.healplus.backend.Model.Entity.Patient;
import com.healplus.backend.Service.Patient.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    /**
     * Obter todos os pacientes
     */
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        try {
            List<Patient> patients = patientService.getAllPatients();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter paciente por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable UUID id) {
        try {
            Patient patient = patientService.getPatientById(id);
            return ResponseEntity.ok(patient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter paciente por email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Patient> getPatientByEmail(@PathVariable String email) {
        try {
            Patient patient = patientService.getPatientByEmail(email);
            return ResponseEntity.ok(patient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter paciente por CPF
     */
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Patient> getPatientByCpf(@PathVariable String cpf) {
        try {
            Patient patient = patientService.getPatientByCpf(cpf);
            return ResponseEntity.ok(patient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Criar novo paciente
     */
    @PostMapping
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody Patient patient) {
        try {
            Patient createdPatient = patientService.createPatient(patient);
            return ResponseEntity.ok(createdPatient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Atualizar paciente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable UUID id, @Valid @RequestBody Patient patient) {
        try {
            Patient updatedPatient = patientService.updatePatient(id, patient);
            return ResponseEntity.ok(updatedPatient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Deletar paciente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable UUID id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.ok("Paciente deletado com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Buscar pacientes por nome
     */
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatientsByName(@RequestParam String name) {
        try {
            List<Patient> patients = patientService.searchPatientsByName(name);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter pacientes por cidade
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Patient>> getPatientsByCity(@PathVariable String city) {
        try {
            List<Patient> patients = patientService.getPatientsByCity(city);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter pacientes por estado
     */
    @GetMapping("/state/{state}")
    public ResponseEntity<List<Patient>> getPatientsByState(@PathVariable String state) {
        try {
            List<Patient> patients = patientService.getPatientsByState(state);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter pacientes com diabetes
     */
    @GetMapping("/diabetes")
    public ResponseEntity<List<Patient>> getPatientsWithDiabetes() {
        try {
            List<Patient> patients = patientService.getPatientsWithDiabetes();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter pacientes com hipertensão
     */
    @GetMapping("/hypertension")
    public ResponseEntity<List<Patient>> getPatientsWithHypertension() {
        try {
            List<Patient> patients = patientService.getPatientsWithHypertension();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter pacientes com doença vascular periférica
     */
    @GetMapping("/pvd")
    public ResponseEntity<List<Patient>> getPatientsWithPeripheralVascularDisease() {
        try {
            List<Patient> patients = patientService.getPatientsWithPeripheralVascularDisease();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter estatísticas de pacientes
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPatientStatistics() {
        try {
            Map<String, Object> statistics = patientService.getPatientStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter cidades disponíveis
     */
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAvailableCities() {
        try {
            List<String> cities = patientService.getAvailableCities();
            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter estados disponíveis
     */
    @GetMapping("/states")
    public ResponseEntity<List<String>> getAvailableStates() {
        try {
            List<String> states = patientService.getAvailableStates();
            return ResponseEntity.ok(states);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
