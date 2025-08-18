package com.healplus.backend.Service;

import com.healplus.backend.Model.Login;
import com.healplus.backend.Repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class LoginService {
    @Autowired
    private LoginRepository loginRepository;

    public ArrayList<Login> getAllLogins() {
        try {
            return new ArrayList<>(loginRepository.findAll());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving logins: " + e.getMessage());
        }
    }

    public String createLogin(Login login) {
        try {
            if (loginRepository.existsByUsername(login.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            if (loginRepository.existsByEmail(login.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            loginRepository.save(login);
            return "Login created successfully";
        } catch (Exception e) {
            throw new RuntimeException("Error creating login: " + e.getMessage());
        }
    }

    public Login getLoginByEmail(String email) {
        try {
            return loginRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Login not found with email: " + email));
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving login: " + e.getMessage());
        }
    }

    public String deleteLogin(Long id) {
        try {
            if (!loginRepository.findById(id).isPresent()) {
                throw new IllegalArgumentException("Login not found with id: " + id);
            }
            loginRepository.deleteById(id);
            return "Login deleted successfully";
        } catch (Exception e) {
            throw new RuntimeException("Error deleting login: " + e.getMessage());
        }
    }

    public String updateLogin(Long id, Login updatedLogin) {
        try {
            Login existingLogin = loginRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Login not found with id: " + id));

            if (!existingLogin.getUsername().equals(updatedLogin.getUsername()) &&
                    loginRepository.existsByUsername(updatedLogin.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            if (!existingLogin.getEmail().equals(updatedLogin.getEmail()) &&
                    loginRepository.existsByEmail(updatedLogin.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }

            existingLogin.setUsername(updatedLogin.getUsername());
            existingLogin.setEmail(updatedLogin.getEmail());
            existingLogin.setPassword(updatedLogin.getPassword());

            loginRepository.save(existingLogin);
            return "Login updated successfully";
        } catch (Exception e) {
            throw new RuntimeException("Error updating login: " + e.getMessage());
        }
    }
}