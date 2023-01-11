package com.WordListServer.WordListServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    @PostMapping(path="/postNewWord")
    @CrossOrigin
    public @ResponseBody String postNewWord(@RequestParam String word){
        if (wordRepository.existsByWord(word)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "word already exists"); //409
        }
        if (word == "") {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "empty parameters"); //422
        }

        Word n = new Word();
        n.setWord(word);
        wordRepository.save(n);
        return "Saved";
    }

    @PutMapping(path="/putCorrect")
    @CrossOrigin
    public @ResponseBody String putCorrect(@RequestParam String wrongWord, @RequestParam String newWord){
        if (wordRepository.existsByWord(newWord)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "corrected word already exists"); //409
        }
        if (newWord == "" || wrongWord == "") {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "empty parameter"); //422
        }
        if (wordRepository.existsByWord(wrongWord)) {
            Word tmp = wordRepository.findByWord(wrongWord);
            wordRepository.deleteById(tmp.getId());
            Word n = new Word();
            n.setWord(newWord);
            wordRepository.save(n);
            return "Word corrected to " + tmp.getWord();
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such word detected");
        }
    }

    @DeleteMapping(path="/deleteWord")
    @CrossOrigin
    public @ResponseBody String deleteWord(@RequestParam String word){
        if (wordRepository.existsByWord(word)) {
            Word tmp = wordRepository.findByWord(word);
            wordRepository.deleteById(tmp.getId());
            return "Deleted " + word;
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such word detected");
        }
    }

    @DeleteMapping(path="/deleteAll")
    @CrossOrigin
    public @ResponseBody String deleteAllWords(){
        wordRepository.deleteAll();
        return "all words deleted";
    }
}
