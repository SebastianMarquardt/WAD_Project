package com.LoginAndRegistration.LoginAndRegistration;

import org.springframework.stereotype.Service;

@Service
public interface UserService {

    String addNewUser(String name, String password);

    String deleteUser(String name);
    User findUser (String name, String password);
    String patchHighscore (String name, Integer newHighscore);

    Iterable<User> getAllUsers();

    String deleteAllUsers();
}