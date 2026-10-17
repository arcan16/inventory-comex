package com.inventories.config;

import com.inventories.models.UserEntity;
import com.inventories.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Datos del administrador inicial, tomados de variables de entorno (ver application.properties)
    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.email}")
    private String adminEmail;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0) {
            UserEntity admin = new UserEntity();

            admin.setUsuario(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEmail(adminEmail);

            userRepository.save(admin);
        }
    }
}
