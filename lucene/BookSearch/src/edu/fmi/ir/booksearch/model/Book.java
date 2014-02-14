package edu.fmi.ir.booksearch.model;

public class Book {

	private final String title;

	private final String imagePath;

	public Book(final String title) {
		this(title, "");
	}

	public Book(final String title, final String imagePath) {
		this.title = title;
		this.imagePath = imagePath;
	}

	public String getTitle() {
		return title;
	}

	public String getImagePath() {
		return imagePath;
	}

	@Override
	public String toString() {
		return title;
	}

}
