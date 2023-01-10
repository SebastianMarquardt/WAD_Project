package com.WordListServer.WordListServer;

import org.springframework.data.repository.CrudRepository;

public interface WordRepository extends CrudRepository<Word, Integer> {
    long deleteByWord(String word);
    Word findByWord(String word);
    boolean existsByWord(String word);
}
