"use client"
import { useEffect, useState } from "react"

export default function QuoteFromAPI() {
  const [quote, setQuote] = useState({
    content: "",
    author: "",
  });
  useEffect(() => {
    fetch("https://api.quotable.io/quotes/random")
      .then(response => response.json())
      .then(data => setQuote({
        content: data[0]["content"],
        author: data[0]["author"]
      }))
      .catch(error => console.log(error));
  }, [])

  const handleNewQuote = async () => {
    const res = await fetch("https://api.quotable.io/quotes/random").then(res => res.json());
    setQuote({
      content: res[0]["content"],
      author: res[0]["author"]
    }
    );
  }

  return (
    <div className="mt-20 text-center text-4xl">
      <p>Random quote:</p>
      <p className="italic">{quote.content}</p>
      <p>By author:</p>
      <p className="italic">{quote.author}</p>
      <button className="bg-gray-800 text-white" onClick={() => handleNewQuote()}>New Quote</button>
    </div>
  )
}
