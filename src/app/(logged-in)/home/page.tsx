import QuoteFromAPI from "src/components/quote-from-api";

export default function Page() {
  return (
    <div className="w-full text-center">
      <h1 className="text-7xl font-bold">This is Home page.</h1>
      <p className="text-xl">Information to display:</p>
      <ul>
        <li>Recent activity (last book, newly created note)</li>
        <li>Quote (fetch from external API)</li>
        <li>Picture of books or something</li>
      </ul>
      <QuoteFromAPI />
    </div>
  );
}
