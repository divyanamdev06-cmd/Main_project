import React from "react";
import { ArrowLeft, ArrowRight, Clock, Eye } from "lucide-react";

const blogs = [
  {
    title: 'Master the "Tell Me About Yourself" Interview Question',
    category: "Interview Questions",
    author: "Priyanka Bakhtani",
    time: "2104d Ago",
    views: "0",
    image: "https://staticlearn.shine.com/l/m/images/blog/Tell_about_yourself.webp",
  },
  {
    title: "How to Answer “What is Your Biggest Failure?” (With Sample Answer)",
    category: "Interview Questions",
    author: "Harshita Khullar",
    time: "2044d Ago",
    views: "31,823",
    image: "https://staticlearn.shine.com/l/m/images/blog/what_is_your_biggest_failure.webp",
  },
];

const Blogs = () => {
  return (
    <section className="border-t border-gray-100 bg-[#F8F8F7] py-12 sm:py-16">
      <div className="container-app">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title">Trending blogs</h2>
            <p className="section-subtitle mt-1 max-w-md">Tips and stories to help you interview with confidence.</p>
          </div>
          <div className="flex shrink-0 gap-2 self-start sm:self-auto">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
              aria-label="Previous"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
              aria-label="Next"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <li key={blog.title}>
              <article className="card flex flex-col gap-5 p-6 transition hover:shadow-md sm:flex-row sm:items-stretch sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-snug text-gray-900">{blog.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{blog.category}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-gray-200" />
                    <span className="text-sm text-gray-600">By {blog.author}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {blog.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye size={14} />
                      {blog.views}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <img
                    src={blog.image}
                    alt=""
                    className="h-20 w-28 rounded-lg object-cover ring-1 ring-black/5 sm:h-24 sm:w-32"
                  />
                  <button type="button" className="btn btn-outline rounded-full px-4 py-2 text-sm whitespace-nowrap">
                    Read now
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="text-sm font-semibold text-yellow-700 underline decoration-yellow-400/80 underline-offset-4 hover:text-yellow-800"
          >
            View all
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
