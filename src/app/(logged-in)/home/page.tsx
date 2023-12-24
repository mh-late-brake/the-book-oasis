import QuoteFromAPI from "src/components/quote-from-api";

export default function Page() {
  return (
    <div>
      <div className="flex items-center justify-end px-5 py-5">
        <div className="w-2/5">
          <QuoteFromAPI />
        </div>
      </div>
    </div>
  );
}
