import { motion } from "framer-motion";
import Form from "./components/Form";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4 py-2 sm:py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full mx-auto overflow-hidden bg-white rounded-2xl shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Image and animated elements - Modified for mobile */}
          <div
            className="relative h-40 md:h-auto overflow-hidden"
            style={{ backgroundColor: "#78917D" }}
          >
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: "url('/assets/images/yoga-bg.jpg')" }}
            ></div>

            {/* Keep only one animated circle for mobile, both for desktop */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:top-1/4 md:left-1/4 md:w-32 md:h-32 md:transform-none rounded-full bg-white opacity-70 mix-blend-overlay"
            >
              <img
                src="/assets/images/swami1.png"
                alt="Swami Vivekananda Image"
                className="h-full w-full rounded-full"
              />
            </motion.div>

            {/* Second animation only visible on md screens and up */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              className="hidden md:block absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-white opacity-50 mix-blend-overlay"
            >
              <img
                src="/assets/images/swami2.png"
                alt="Swami Vivekananda Image"
                className="h-40 w-40 rounded-full"
              />
            </motion.div>

            {/* Logo and text */}
            <div className="relative flex flex-col justify-end sm:justify-center items-center h-full px-8 text-white">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
                  MoskhaVidya Yoga Mandir
                </h1>
                <p className="text-sm md:text-lg opacity-90 mb-1 md:mb-2">
                  Find your inner peace
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right side - Form component */}
          <div className="p-4 sm:p-8">
            <Form />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
