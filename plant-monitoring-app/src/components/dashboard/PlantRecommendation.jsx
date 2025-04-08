import { motion } from "framer-motion";

const PlantRecommendation = ({ crops }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-medium text-white mb-4">Recommended Crops</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {crops.map((crop, index) => (
          <motion.div
            key={index}
            className="bg-gray-700 p-3 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: index * 0.01 }}
            whileHover={{ scale: 1.02,}}
          >
            <h4 className="text-white font-medium">{crop.name}</h4>
            <p className="text-sm text-gray-400 mt-1">Match: {crop.probability}%</p>
            <div className="w-full bg-gray-600 h-2 rounded-full mt-2">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${crop.probability}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlantRecommendation;
