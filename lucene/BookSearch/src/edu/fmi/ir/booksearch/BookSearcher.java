package edu.fmi.ir.booksearch;

import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONObject;

public class BookSearcher {

	private BookIndex index;

	public BookSearcher() throws IOException {
		index = new BookIndex();
	}

	public String query(final String indexPath, final String query) {
		final JSONArray result = index.query(indexPath, query);
		final JSONObject resultJson = new JSONObject();
		resultJson.put("books", result);
		return resultJson.toString();
	}

	public static void main(String[] args) throws IOException {
		final BookSearcher searcher = new BookSearcher();
		System.out.println(searcher.query(args[0], args[1]));
	}
}
