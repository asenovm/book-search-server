package edu.fmi.ir.booksearch;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.util.Version;
import org.json.JSONArray;
import org.json.JSONObject;

public class BookIndex {

	private final IndexWriter writer;

	private static final String FIELD_CONTENT = "content";

	public BookIndex() throws IOException {
		final RAMDirectory indexDirectory = new RAMDirectory();
		final IndexWriterConfig config = new IndexWriterConfig(
				Version.LUCENE_46, new StandardAnalyzer(Version.LUCENE_46));
		writer = new IndexWriter(indexDirectory, config);
	}

	public JSONArray query(final String queryString) {
		final JSONArray result = new JSONArray();
		try {
			final StandardAnalyzer analyzer = new StandardAnalyzer(
					Version.LUCENE_46);
			final QueryParser parser = new QueryParser(Version.LUCENE_46,
					FIELD_CONTENT, analyzer);
			final Query query = parser.parse(queryString);
			final TopScoreDocCollector collector = TopScoreDocCollector.create(
					10, true);

			final IndexSearcher searcher = new IndexSearcher(
					DirectoryReader.open(FSDirectory.open(new File(
							"indexDirectory"))));
			searcher.search(query, collector);

			final ScoreDoc[] scoreDocs = collector.topDocs().scoreDocs;
			for (final ScoreDoc doc : scoreDocs) {
				final JSONObject docJson = new JSONObject();
				docJson.put("title", "test");
				docJson.put("relevance", doc.score);
				result.put(docJson);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return result;
	}
}
