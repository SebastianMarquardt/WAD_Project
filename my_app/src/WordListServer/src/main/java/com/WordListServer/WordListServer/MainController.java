package com.WordListServer.WordListServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path="/words")
public class MainController {

    @Autowired
    private WordRepository wordRepository;

    @GetMapping(path="/getAll")
    @CrossOrigin
    public @ResponseBody Iterable<Word> getAllWords() {
        return wordRepository.findAll();
    }
}
