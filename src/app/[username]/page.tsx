import { Button } from "~/components/ui/button"
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from "next/navigation"
import { api } from "~/trpc/server"
import type { Book } from "@prisma/client"
import { auth } from "~/server/auth"

export default async function UserPage({
  params: { username },
}: {
  params: { username: string }
}) {
  const session = await auth();
  const isOwnProfile = session?.user?.name === username;
  
  // Fetch all books for this user
  const books = await api.book.getBooksByUsername({ username });
  
  if (!books) {
    notFound();
  }

  // Group books by status
  const booksData = {
    wantToRead: books.filter(book => book.status === 'WANT_TO_READ'),
    currentlyReading: books.filter(book => book.status === 'CURRENTLY_READING'),
    read: books.filter(book => book.status === 'READ'),
  }

   return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl mb-20 text-center">{username}&apos;s ReadShelf</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">Want to Read</h2>
            {isOwnProfile && (
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/${username}/create?status=WANT_TO_READ`}>
                  <PlusCircle className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
          <BookSection books={booksData.wantToRead} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">Currently Reading</h2>
            {isOwnProfile && (
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/${username}/create?status=CURRENTLY_READING`}>
                  <PlusCircle className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
          <BookSection books={booksData.currentlyReading} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">Read</h2>
            {isOwnProfile && (
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/${username}/create?status=READ`}>
                  <PlusCircle className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
          <BookSection books={booksData.read} />
        </div>
      </div>
    </div>
  )
}

function BookSection({ 
  books,
}: { 
  books: Book[];
}) {
  return (
    <div>
      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="flex items-start space-x-4">
            <div className="relative">
              <Image
                src={book.coverUrl ?? "https://placehold.co/400x600/e2e8f0/1e293b.png?text=No+Cover"}
                alt={`Cover of ${book.name}`}
                width={50}
                height={75}
                className="object-cover rounded-sm"
              />
              <div className="absolute inset-0 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_0_rgba(0,0,0,0.1)] rounded-sm pointer-events-none"></div>
            </div>
            <div>
              <h3 className="font-medium text-sm">{book.name}</h3>
              <p className="text-sm text-gray-500">{book.author}</p> 
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
