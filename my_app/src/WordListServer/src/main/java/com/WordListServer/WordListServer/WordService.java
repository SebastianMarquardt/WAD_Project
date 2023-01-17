package com.WordListServer.WordListServer;

import org.springframework.stereotype.Service;

@Service
public interface WordService {

    Iterable<Word> getAllWords();

    String postNewWord(String word);

    String putCorrect(String wrongWord, String newWord);

    String deleteAllWords();

    String deleteWord(String word);
}
