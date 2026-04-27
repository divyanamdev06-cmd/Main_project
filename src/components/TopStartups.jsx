import React from "react";

const startups = [
  {
    name: "DeHaat",
    category: "Agri-Tech",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/dehaat_circle_d.svg",
  },
  {
    name: "BharatPe",
    category: "Fintech",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/bharatpe_circle_d.svg",
  },
  {
    name: "Jivi.AI",
    category: "Health-Tech",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/jivai_circle_d.svg",
  },
  {
    name: "Gojek",
    category: "Mobility",
    logo: "https://candidate-static.s3.ap-south-1.amazonaws.com/c/s1/images/candidate/nova/home/gojek_circle_d.svg",
  },
];

const TopStartups = () => {
  return (
    <section className="border-t border-gray-100 bg-white py-12 sm:py-16">
      <div className="container-app">
        <div className="flex justify-center">
          <span className="badge border-gray-200 bg-gray-100 text-gray-800">Top startups hiring</span>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {startups.map((item) => (
            <li key={item.name}>
              <article className="card flex h-full flex-col items-center p-6 text-center transition hover:shadow-md">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-100 bg-gray-50">
                  <img src={item.logo} alt="" className="h-14 w-14 object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                <button type="button" className="btn btn-outline mt-6 w-full rounded-full text-sm">
                  View
                </button>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TopStartups;
