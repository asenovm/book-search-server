package edu.fmi.ir.booksearch;

import java.awt.print.Book;
import java.util.LinkedList;
import java.util.List;

public class BookSearcher {

	public List<Book> getMatches(final String query) {
		final List<Book> results = new LinkedList<Book>();
		return results;
	}

	public static void main(String[] args) {
		final BookSearcher searcher = new BookSearcher();
		searcher.getMatches("test");
	}
}