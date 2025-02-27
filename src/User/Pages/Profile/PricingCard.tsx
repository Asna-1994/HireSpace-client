import { FaCheck, FaCrown } from "react-icons/fa";
import { Plans } from "../../../Utils/Interfaces/interface";
import { motion } from 'framer-motion';

const PricingCard: React.FC<{
    plan: Plans;
    selected: boolean;
    onSelect: (plan: Plans) => void;
  }> = ({ plan, selected, onSelect }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl shadow-lg ${
        selected
          ? 'bg-gradient-to-r from-purple-400 to-blue-500 text-white'
          : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-2xl font-bold ${selected ? 'text-white' : 'text-gray-800'}`}
        >
          {plan.planType}
        </h3>
        <FaCrown
          className={`text-2xl ${selected ? 'text-white' : 'text-blue-500'}`}
        />
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold">₹{plan.price}</span>
        <span className={`${selected ? 'text-white' : 'text-gray-600'}`}>
          /{plan.durationInDays}
        </span>
      </div>
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <FaCheck
              className={`mr-2 ${selected ? 'text-white' : 'text-green-500'}`}
            />
            <span className={selected ? 'text-white' : 'text-gray-600'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          selected
            ? 'bg-white text-blue-500 hover:bg-gray-100'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {selected ? 'Selected' : 'Choose Plan'}
      </button>
    </motion.div>
  );
  export default PricingCard  