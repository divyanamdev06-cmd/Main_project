import React from "react";

const Cards = () => {
  return (
    <section className="border-t border-gray-100 bg-white py-12 sm:py-14">
      <div className="container-app">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="flex flex-col gap-6 rounded-3xl border border-orange-100/90 bg-linear-to-br from-[#fff7ed] to-[#fdebd0] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                Empower <span className="text-orange-500">Skills</span>
                <br />
                Elevate <span className="text-orange-500">Career</span>
              </h2>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">Connect with top mentors and grow faster.</p>
              <button type="button" className="btn btn-outline mt-5 w-full sm:mt-6 sm:w-auto">
                Upcoming Events →
              </button>
            </div>
            <img
              src="https://i.pinimg.com/1200x/6f/e2/aa/6fe2aa853ec78e80c1e977ac21423187.jpg"
              alt=""
              className="mx-auto h-32 w-32 shrink-0 rounded-2xl object-cover shadow-md sm:mx-0 sm:h-36 sm:w-36"
            />
          </article>

          <article className="flex flex-col gap-6 rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 to-blue-200/50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                Now live
              </span>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                Jobnest <span className="text-blue-600">Express</span>
              </h2>
              <p className="mt-2 text-sm text-gray-700 sm:text-base">AI-assisted hiring workflows for your team.</p>
              <p className="mt-1 text-sm text-gray-600">Post a role today and reach the right talent.</p>
              <button type="button" className="btn btn-outline mt-5 w-full sm:mt-6 sm:w-auto">
                Post a Job →
              </button>
            </div>
            <img
              src="https://i.pinimg.com/736x/b7/75/05/b7750506d2603c7387be7fa687465de2.jpg"
              alt=""
              className="mx-auto h-32 w-32 shrink-0 rounded-2xl object-cover shadow-md sm:mx-0 sm:h-36 sm:w-36"
            />
          </article>
        </div>
      </div>
    </section>
  );
};

export default Cards;
