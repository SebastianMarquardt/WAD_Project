package com.WordListServer.WordListServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path="/words")
public class WordController {

    @Autowired
    private WordService wordService;

    @GetMapping(path="/getAll")
    @CrossOrigin
    public @ResponseBody Iterable<Word> getAllWords() {
        return wordService.getAllWords();
    }

    @PostMapping(path="/postNewWord")
    @CrossOrigin
    public @ResponseBody String postNewWord(@RequestParam String word){
        return wordService.postNewWord(word);
    }

    @PutMapping(path="/putCorrect")
    @CrossOrigin
    public @ResponseBody String putCorrect(@RequestParam String wrongWord, @RequestParam String newWord){
        return wordService.putCorrect(wrongWord, newWord);
    }

    @DeleteMapping(path="/deleteWord")
    @CrossOrigin
    public @ResponseBody String deleteWord(@RequestParam String word){
        return deleteWord(word);
    }

    @DeleteMapping(path="/deleteAll")
    @CrossOrigin
    public @ResponseBody String deleteAllWords(){
        return wordService.deleteAllWords();
    }
}
