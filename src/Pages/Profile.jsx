import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Profile() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">

        {/* Profile Image */}
        <div className="w-24 h-24 mx-auto rounded-full bg-yellow-400 text-white flex items-center justify-center text-3xl font-bold">
          D
        </div>

        {/* Name */}
        <h2 className="text-xl font-semibold text-gray-700 mt-4">
         Divya Namdev
        </h2>

        {/* Role */}
        <p className="text-sm text-gray-400">
          Administrator
        </p>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">

          <InfoItem icon={<Mail size={18} />} label="Email" value="divyanamde06@gmail.com" />
          <InfoItem icon={<Phone size={18} />} label="Mobile" value="7000142537" />
          <InfoItem icon={<MapPin size={18} />} label="Location" value="India" />
          <InfoItem icon={<Calendar size={18} />} label="Joined" value="Jan 2026" />

        </div>

        {/* Button */}
        <button className="mt-8 bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500 transition">
          Edit Profile
        </button>

      </div>
    </div>
  );
}

/* Reusable Info Row */
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
      <div className="text-yellow-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value}</p>
      </div>
    </div>
  );
}