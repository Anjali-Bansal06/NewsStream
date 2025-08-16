import { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import "./styles.css";


const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;

export default function App() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchArticles();
  }, [query]);

  const fetchArticles = async () => {
    try {
      const endpoint = query
        ? `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=10&apiKey=${API_KEY}`
        : `https://newsapi.org/v2/top-headlines?country=us&page=${page}&pageSize=10&apiKey=${API_KEY}`;
      const res = await axios.get(endpoint);
      const newArticles = res.data.articles;

      if (page === 1) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }

      if (newArticles.length < 10) setHasMore(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (page > 1) fetchArticles();
  }, [page]);

  return (
    <div className="container">
      <h1>NewsStream</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {articles.map((article, index) => (
          <div className="article" key={index}>
            {article.urlToImage && (
              <img src={article.urlToImage} alt="news" />
            )}
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}