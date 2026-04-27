import React, { useState } from "react";

export default function UserProfile() {
  const [edit, setEdit] = useState(false);

  const [user, setUser] = useState({
    name: "Divya Namdev",
    email: "divya@gmail.com",
    mobile: "9876543210",
    city: "Bhopal",
    state: "Madhya Pradesh",
    skills: "React, Node.js, MongoDB",
    bio: "Passionate developer looking for opportunities",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-[#F6C85F]">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-yellow-400 text-white flex items-center justify-center rounded-full text-2xl font-bold">
              {user.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="bg-[#F6C85F] text-white px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            {edit ? "Save" : "Edit Profile"}
          </button>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-4">

          <InputField label="Full Name" name="name" value={user.name} onChange={handleChange} edit={edit} />
          <InputField label="Email" name="email" value={user.email} onChange={handleChange} edit={edit} />
          <InputField label="Mobile" name="mobile" value={user.mobile} onChange={handleChange} edit={edit} />
          <InputField label="City" name="city" value={user.city} onChange={handleChange} edit={edit} />
          <InputField label="State" name="state" value={user.state} onChange={handleChange} edit={edit} />

          {/* Skills */}
          <div className="col-span-2">
            <label className="text-gray-600 text-sm">Skills</label>
            {edit ? (
              <input
                name="skills"
                value={user.skills}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            ) : (
              <p className="mt-1 text-gray-700">{user.skills}</p>
            )}
          </div>

          {/* Bio */}
          <div className="col-span-2">
            <label className="text-gray-600 text-sm">Bio</label>
            {edit ? (
              <textarea
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            ) : (
              <p className="mt-1 text-gray-700">{user.bio}</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* Reusable Input Field */
function InputField({ label, name, value, onChange, edit }) {
  return (
    <div>
      <label className="text-gray-600 text-sm">{label}</label>
      {edit ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      ) : (
        <p className="mt-1 text-gray-700">{value}</p>
      )}
    </div>
  );
}