import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { createBook } from "./actions";

export default async function CreateBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ status?: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ' }>;
}) {
  const session = await auth();
  const username = (await params).username;
  const status = (await searchParams).status;
  // Only allow authenticated users to access their own create page
  if (!session?.user?.name || session.user.name !== username) {
    redirect(`/${username}`);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl mb-20 text-center">Add a Book</h1>

      <div className="max-w-md mx-auto">
        <form action={createBook} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Book Title
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-800 focus:outline-none focus:ring-red-800 sm:text-sm"
              placeholder="Enter book title"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              name="author"
              id="author"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-800 focus:outline-none focus:ring-red-800 sm:text-sm"
              placeholder="Enter author name"
              required
            />
          </div>

          <div>
            <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700">
              Cover URL (optional)
            </label>
            <input
              type="url"
              name="coverUrl"
              id="coverUrl"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-800 focus:outline-none focus:ring-red-800 sm:text-sm"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Reading Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-800 focus:outline-none focus:ring-red-800 sm:text-sm"
              required
              defaultValue={status}
            >
              <option value="WANT_TO_READ">Want to Read</option>
              <option value="CURRENTLY_READING">Currently Reading</option>
              <option value="READ">Read</option>
            </select>
          </div>

          <Button 
            type="submit"
            className="w-full"
          >
            Add Book
          </Button>
        </form>
      </div>
    </div>
  );
} 