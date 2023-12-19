export default function Page() {
  return (
    <div className="text-center text-xl">
      <h1 className="text-7xl">This is Notes page</h1>
      <p>Feature:</p>
      <ul>
        <li>Display all notes of use</li>
        <li>Button to create new note (will display new window)</li>
        <li>Sort notes by date (newest, oldest)</li>
        <li>
          Categorize notes by associated book (or free note - not link to any
          book)
        </li>
      </ul>
    </div>
  );
}
