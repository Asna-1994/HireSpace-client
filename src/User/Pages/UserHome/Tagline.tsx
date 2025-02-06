
import { FaPen } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const TaglineSection = ({ user, tagline, setTagline, saveTagline }: any) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagline(e.target.value);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md rounded-lg p-6 text-white text-center max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold">Welcome, {user?.userName}!</h2>

      {/* Tagline Display */}
      {!isEditing ? (
        <div className="flex items-center justify-center mt-2 space-x-2">
          <p className="text-lg md:text-xl">{user?.tagLine || "Add a tagline to stand out!"}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-white hover:text-gray-300"
          >
            <FaPen className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      ) : (
        // Tagline Edit Mode
        <div className="flex flex-col sm:flex-row items-center justify-center mt-4 space-y-2 sm:space-y-0 sm:space-x-2 w-full">
          <input
            type="text"
            value={tagline}
            onChange={handleTaglineChange}
            className="px-4 py-2 w-full sm:w-auto rounded-md text-black focus:ring focus:ring-blue-300 border"
            placeholder="E.g., Aspiring Software Developer"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              saveTagline();
              setIsEditing(false);
            }}
            className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Save
          </motion.button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-300 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default TaglineSection;
