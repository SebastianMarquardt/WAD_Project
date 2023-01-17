package com.LoginAndRegistration.LoginAndRegistration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path="/login")
public class MainController {

    @Autowired
    UserService userService;

    @PostMapping(path="/postUser")
    @CrossOrigin
    public @ResponseBody String addNewUser (@RequestParam String name, @RequestParam String password) {
        return userService.addNewUser(name,password);
    }

    @DeleteMapping(path="/deleteUser")
    @CrossOrigin
    public @ResponseBody String deleteUser(@RequestParam String name) {
        return userService.deleteUser(name);
    }

    @PostMapping
    @CrossOrigin
    public @ResponseBody User findUser (@RequestParam String name, @RequestParam String password) {
        return userService.findUser(name, password);
    }

    @PatchMapping(path="/patchHighscore")
    @CrossOrigin
    public @ResponseBody String patchHighscore (@RequestParam String name, @RequestParam Integer newHighscore) {
        return userService.patchHighscore(name, newHighscore);
    }

    @GetMapping(path="/getAllUsers")
    @CrossOrigin
    public @ResponseBody Iterable<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping(path="/deleteAllUsers")
    @CrossOrigin
    public @ResponseBody String deleteAllUsers() {
        return userService.deleteAllUsers();
    }
}