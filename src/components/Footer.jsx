import { Link } from "react-router-dom";

const footerLink = "text-sm text-blue-100/90 transition hover:text-white";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#243b6b] text-white">
      <div className="container-app py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <div className="text-xl font-extrabold tracking-tight">
              Jobnest<span className="text-[#F6C85F]">.com</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-blue-100/90">
              JobNest connects job seekers, recruiters, and admins on one stack — profiles, categories, and live job
              discovery with search built in.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/90">Discover</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className={footerLink}>
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#browse-jobs" className={footerLink}>
                    Browse jobs
                  </a>
                </li>
                <li>
                  <Link to="/explore-jobs" className={footerLink}>
                    Explore page
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className={footerLink}>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/90">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className={footerLink}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className={footerLink}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/90">Trust</h3>
              <ul className="space-y-2">
                <li>
                  <span className={`${footerLink} cursor-default`}>Privacy policy</span>
                </li>
                <li>
                  <span className={`${footerLink} cursor-default`}>Terms of use</span>
                </li>
                <li>
                  <span className={`${footerLink} cursor-default`}>Report a concern</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-blue-100/90 sm:flex-row">
          <p>© {new Date().getFullYear()} JobNest. All rights reserved.</p>
          <p className="text-center text-xs sm:text-right">
            Built for learning and demos — extend with applications, alerts, and payments as you grow.
          </p>
        </div>
      </div>
    </footer>
  );
}
