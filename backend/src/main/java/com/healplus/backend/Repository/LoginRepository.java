package com.healplus.backend.Repository;
import com.healplus.backend.Model.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginRepository extends JpaRepository<Login, Long> {

    List<Login> findAll();
    
    Login save(Login login);
    
    Optional<Login> findById(Long id);
    
    void deleteById(Long id);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    Optional<Login> findByUsername(String username);
    
    Optional<Login> findByEmail(String email);

    
}
