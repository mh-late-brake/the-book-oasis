export default function TextArea() {
  return (
    <div className="m-auto w-3/5">
      <form>
        <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between border-t px-3 py-0">
            <div>
              <input
                type="text"
                className="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2 pt-2 text-lg font-medium text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder="Note Title"
                required
              />
            </div>
            <div>
              <select
                className="text-md w-auto rounded-lg border border-gray-300 bg-transparent p-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                defaultValue={""}
              >
                <option value="">General Note</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>
              <button
                type="submit"
                className="ml-6 inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200"
              >
                Create Note
              </button>
            </div>
          </div>
          <div className="rounded-t-lg bg-white px-4 py-2">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows={4}
              className="h-60 w-full border-0 bg-white px-0 text-sm text-gray-900 outline-none"
              placeholder="Write a note..."
              required
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}
