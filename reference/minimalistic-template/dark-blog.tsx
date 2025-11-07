// @ts-nocheck
import React, { useState } from 'react';

export default function DarkBlog() {
  const [selectedPost, setSelectedPost] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with React",
      excerpt: "Learn the fundamentals of React and start building modern web applications today.",
      date: "Oct 10, 2025",
      category: "Development",
      content: "React has revolutionized the way we build user interfaces. In this comprehensive guide, we'll explore the core concepts that make React so powerful and learn how to build your first application..."
    },
    {
      id: 2,
      title: "The Power of Tailwind CSS",
      excerpt: "Discover how utility-first CSS can speed up your development workflow.",
      date: "Oct 8, 2025",
      category: "Design",
      content: "Tailwind CSS offers a unique approach to styling web applications. Instead of writing custom CSS, you compose your designs using utility classes directly in your HTML..."
    },
    {
      id: 3,
      title: "Modern JavaScript Features",
      excerpt: "Explore the latest JavaScript features that make coding more efficient and enjoyable.",
      date: "Oct 5, 2025",
      category: "JavaScript",
      content: "JavaScript continues to evolve with new features that make development easier. Let's dive into arrow functions, destructuring, async/await, and more..."
    }
  ];

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-blue-400 hover:text-blue-300 mb-4"
            >
              ← Back to all posts
            </button>
            <h1 className="text-4xl font-bold mb-2">{selectedPost.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{selectedPost.date}</span>
              <span>•</span>
              <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded">
                {selectedPost.category}
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 leading-relaxed">{selectedPost.content}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">My Dark Blog</h1>
          <p className="text-gray-400">Thoughts on development, design, and technology</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-400">{post.date}</span>
                <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">
                  {post.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-100 hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{post.excerpt}</p>
              <div className="mt-4">
                <span className="text-blue-400 hover:text-blue-300 text-sm">
                  Read more →
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p>© 2025 My Dark Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}