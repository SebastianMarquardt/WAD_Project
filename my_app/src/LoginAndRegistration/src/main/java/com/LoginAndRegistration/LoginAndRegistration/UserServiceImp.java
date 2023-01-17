package com.LoginAndRegistration.LoginAndRegistration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public String addNewUser(String name, String password) {
        if (userRepository.existsByName(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "user already exists"); //409
        }
        if (name == "" || password == "") {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "empty parameters"); //422
        }
        User n = new User();
        n.setName(name);
        n.setPassword(password);
        n.setHighscore(0);
        userRepository.save(n);
        return "Saved";
    }

    @Override
    public String deleteUser(String name) {
        if (userRepository.existsByName(name)) {
            User tmp = userRepository.findByName(name);
            userRepository.deleteById(tmp.getId());
            return "Deleted " + name;
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such user detected");
        }
    }

    @Override
    public User findUser(String name, String password) {
        if (userRepository.existsByName(name)) {
            User tmp = userRepository.findByName(name);
            if (tmp.checkPassword(password)) {
                return tmp;
            }
            else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "wrong password");
            }
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such user detected");
        }
    }

    @Override
    public String patchHighscore(String name, Integer newHighscore) {
        if (userRepository.existsByName(name)) {
            User tmp = userRepository.findByName(name);
            tmp.setHighscore(newHighscore);
            userRepository.save(tmp);
            return "Highscore for " + tmp.getName() + " updated to " + tmp.getHighscore();
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such user detected");
        }
    }

    @Override
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public String deleteAllUsers() {
        userRepository.deleteAll();
        addNewUser("admin", "admin");
        return "All users deleted";
    }
}
