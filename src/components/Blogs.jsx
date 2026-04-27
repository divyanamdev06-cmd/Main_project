import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

const guides = [
  {
    title: "Answer “Tell me about yourself” without rambling",
    category: "Interview playbook",
    readTime: "6 min read",
    blurb: "A tight structure interviewers remember: past, present, future — tied to the role you want.",
  },
  {
    title: "Talk about failure without sinking the interview",
    category: "Interview playbook",
    readTime: "5 min read",
    blurb: "Use the STAR format with honest ownership and a clear lesson — then pivot to how you work today.",
  },
];

export default function Blogs() {
  return (
    <section className="border-t border-gray-100 bg-[#F8F8F7] py-14 sm:py-16">
      <div className="container-app">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Career guides
            </span>
            <h2 className="section-title mt-2">Get interview-sharp</h2>
            <p className="section-subtitle mt-1 max-w-lg">
              Short reads you can use before your next screen — no fluff, no outdated “2104 days ago” timestamps.
            </p>
          </div>
          <Link
            to="/blogs"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-amber-800 hover:text-amber-950"
          >
            View all articles
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {guides.map((post) => (
            <li key={post.title}>
              <article className="card flex h-full flex-col p-6 transition hover:border-amber-200/80 hover:shadow-md sm:p-7">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{post.category}</p>
                <h3 className="mt-2 text-lg font-bold leading-snug text-gray-900">{post.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{post.blurb}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {post.readTime}
                  </span>
                  <Link to="/blogs" className="btn btn-outline px-4 py-2 text-sm no-underline">
                    Open blog
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
