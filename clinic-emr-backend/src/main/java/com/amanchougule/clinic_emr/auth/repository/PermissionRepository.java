package com.amanchougule.clinic_emr.auth.repository;

import com.amanchougule.clinic_emr.auth.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long>{

Optional<Permission> findByName(String name);

boolean existsByName(String name);
}