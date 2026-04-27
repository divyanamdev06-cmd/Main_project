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
    title:
      "How to Answer “What is Your Biggest Failure?” (With Sample Answer)",
    category: "Interview Questions",
    author: "Harshita Khullar",
    time: "2044d Ago",
    views: "31,823",
    image: "https://staticlearn.shine.com/l/m/images/blog/what_is_your_biggest_failure.webp",
  },
];

const Blogs = () => {
  return (
    <div className="w-full bg-[#F8F8F7] py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Trending Blogs
          </h2>

          {/* Arrows */}
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <ArrowLeft size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white  rounded-2xl border border-gray-200 p-6 flex justify-between items-start hover:shadow-md transition"
            >
              {/* Left Content */}
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-gray-800 leading-snug">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  {blog.category}
                </p>

                {/* Author */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-600">
                    By {blog.author}
                  </span>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-6">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {blog.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {blog.views}
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="flex flex-col items-end justify-between">
                <img
                  src={blog.image}
                  alt="blog"
                  className="w-28 h-20 object-cover rounded-md"
                />

                <button className="mt-6 px-5 py-2 border border-yellow-400 text-yellow-600 rounded-full text-sm hover:bg-yellow-50 transition">
                  Read Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-10">
          <button className="text-yellow-600 font-medium border-b border-yellow-500 hover:text-yellow-700">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;