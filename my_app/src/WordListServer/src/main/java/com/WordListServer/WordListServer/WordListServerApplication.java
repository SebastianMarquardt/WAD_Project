package com.WordListServer.WordListServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WordListServerApplication {

	@Autowired
	private WordController mainController;

	private String wordApiData;

	public static void main(String[] args) {
		SpringApplication.run(WordListServerApplication.class, args);
	}

/*	@EventListener(ApplicationReadyEvent.class)
	public void initializeWordDatabase() {
		setWordApiData();
	}

	private void setWordApiData() {
		System.out.println("fetching words...");
		for (int i = 0; i < 5; i++) {
			try {
				URL url = new URL("http://random-word-api.herokuapp.com/word");

				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setRequestMethod("GET");
				conn.connect();

				int responseCode = conn.getResponseCode();

				if (responseCode != 200) {
					throw new RuntimeException("HttpResponseCode " + responseCode);
				}
				if (responseCode != 503) {
					System.out.println("waiting for api");
					continue;
				}
				else {
					StringBuilder informationString = new StringBuilder();
					Scanner scanner = new Scanner(url.openStream());

					while (scanner.hasNext()) {
						informationString.append(scanner.nextLine());
					}
					scanner.close();

					JSONParser jsonParser = new JSONParser();
					JSONArray dataObject = (JSONArray) jsonParser.parse(String.valueOf(informationString));

					if (!dataObject.isEmpty()) {
						wordApiData = dataObject.toString();
						wordApiData = wordApiData.substring(2, wordApiData.length() - 2);
						mainController.postNewWord(wordApiData);
					}
				}
			} catch (IOException | ParseException e) {
				throw new RuntimeException(e);
			}
		}
		System.out.println("fetching words done");
	}*/
}
