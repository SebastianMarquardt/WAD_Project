package com.WordListServer.WordListServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WordServiceImp implements WordService {

    @Autowired
    private WordRepository wordRepository;

    @Override
    public Iterable<Word> getAllWords() {
        return wordRepository.findAll();
    }

    @Override
    public String postNewWord(String word) {
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

    @Override
    public String putCorrect(String wrongWord, String newWord) {
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

    @Override
    public String deleteAllWords() {
        wordRepository.deleteAll();
        return "all words deleted";
    }

    @Override
    public String deleteWord(String word) {
        if (wordRepository.existsByWord(word)) {
            Word tmp = wordRepository.findByWord(word);
            wordRepository.deleteById(tmp.getId());
            return "Deleted " + word;
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such word detected");
        }
    }
}
