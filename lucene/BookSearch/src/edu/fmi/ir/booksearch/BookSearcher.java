package edu.fmi.ir.booksearch;

import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONObject;

public class BookSearcher {

	private BookIndex index;

	public void index(final String directoryPath) throws IOException {
		index = new BookIndex();
		index.indexDirectory(directoryPath);
	}

	public String query(final String query) {
		final JSONArray result = index.query(query);
		final JSONObject resultJson = new JSONObject();
		resultJson.put("books", result);
		return resultJson.toString();
	}

	public static void main(String[] args) throws IOException {
		final BookSearcher searcher = new BookSearcher();
		searcher.index(args[0]);
		System.out.println(searcher.query(args[1]));
	}
}
