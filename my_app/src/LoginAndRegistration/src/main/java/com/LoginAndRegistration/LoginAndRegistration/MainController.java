package com.LoginAndRegistration.LoginAndRegistration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

@Controller
@RequestMapping(path="/login")
public class MainController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping(path="/postUser")
    @CrossOrigin
    public @ResponseBody String addNewUser (@RequestParam String name, @RequestParam String password) {
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

    @DeleteMapping(path="/deleteUser")
    @CrossOrigin
    public @ResponseBody String deleteUser(@RequestParam String name) {
        if (userRepository.existsByName(name)) {
            User tmp = userRepository.findByName(name);
            userRepository.deleteById(tmp.getId());
            return "Deleted " + name;
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such user detected");
        }
    }

    @PostMapping
    @CrossOrigin
    public @ResponseBody User findUser (@RequestParam String name, @RequestParam String password) {
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

    @PatchMapping(path="/patchHighscore")
    @CrossOrigin
    public @ResponseBody String patchHighscore (@RequestParam String name, @RequestParam Integer newHighscore) {
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

    @GetMapping(path="/getAllUsers")
    @CrossOrigin
    public @ResponseBody Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping(path="/deleteAllUsers")
    @CrossOrigin
    public @ResponseBody String deleteAllUsers() {
        userRepository.deleteAll();
        return "All users deleted";
    }
}