package com.LoginAndRegistration.LoginAndRegistration;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    void deleteByName(String name);
    boolean existsByName(String name);
    User findByName(String name);

}