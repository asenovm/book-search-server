package edu.fmi.ir.booksearch;

import java.util.Map;

import edu.fmi.ir.booksearch.model.Book;

public class BookSearcher {

	public void index(final String directoryPath) {
		try {
			final BookIndex index = new BookIndex();
			index.indexDirectory(directoryPath);
			final Map<Book, Float> result = index.query("отиде там");
			System.out.println(result);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void main(String[] args) {
		final BookSearcher searcher = new BookSearcher();
		searcher.index("../books");
	}
}
