import { useState } from "react";
import { generateReceipt } from "../utils/pdfGenerator";
import { motion } from "framer-motion";

const YogaReceiptForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", amount: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
      valid = false;
    }

    if (!formData.amount || parseFloat(formData.amount) < 1) {
      newErrors.amount = "Amount must be at least $1";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await generateReceipt(formData.name, parseFloat(formData.amount || "0")); // Ensures amount is always a valid number
      setIsSuccess(true);
      setTimeout(() => {
        setFormData({ name: "", amount: "" });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error generating receipt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] font-sans relative">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <img
          src="/api/placeholder/1200/800"
          alt="Yoga background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header with logo */}
      <header className="bg-[#78917D] py-6 px-4 shadow-md relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-1 mr-3">
              <img
                src="../../public/assets/images/logo.png"
                alt="MokshaVidya Logo"
                className="h-14 w-14 rounded-full"
              />
            </div>
            <div className="text-[#F5F0E6]">
              <h1 className="font-bold text-xl">MokshaVidya YogaMandir</h1>
              {/* <p className="text-sm">YogaMandir</p> */}
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="text-[#F5F0E6] text-center">
            <p className="text-sm italic">Find balance. Find peace.</p>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="inline-block h-1 w-10 bg-[#D7CCB9] ml-1 rounded-full"
                ></span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Decorative wave pattern */}
      <div className="relative h-6 overflow-hidden">
        <div className="absolute left-0 right-0">
          {[1, 2, 3].map((i) => (
            <svg
              key={i}
              className="w-full h-6 fill-[#78917D]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              style={{ opacity: 1 - i * 0.2 }}
            >
              <path d="M0,0 C150,120 350,0 500,100 C650,200 850,0 1200,80 L1200,0 Z"></path>
            </svg>
          ))}
        </div>
      </div>

      {/* Main content container */}
      <main className="max-w-5xl mx-auto py-6 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden"
        >
          {/* Lotus flower decorative element */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 pointer-events-none">
            <svg className="w-40 h-40 fill-[#AF5F4B]" viewBox="0 0 100 100">
              <path d="M50,20 C60,35 80,35 90,25 C80,40 90,60 70,65 C85,70 85,90 70,95 C65,75 45,85 30,95 C25,80 10,75 5,60 C25,65 35,45 20,30 C35,35 45,30 50,20 Z"></path>
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-[#2A5359] mb-2">
              Receipt Generator
            </h2>
            <p className="text-gray-600 mb-6">
              Fill out the form to download this month's yoga contribution
              receipt.
            </p>
          </motion.div>

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Success! Your receipt has been downloaded.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`pl-10 w-full rounded-lg border ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#78917D] focus:border-[#78917D]"
                  } shadow-sm py-3`}
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`pl-10 w-full rounded-lg border ${
                    errors.amount
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#78917D] focus:border-[#78917D]"
                  } shadow-sm py-3`}
                />
              </div>
              {errors.amount && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.amount}
                </motion.p>
              )}
            </motion.div>

            {/* Additional info section - decorative */}
            {/* <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-[#F5F0E6] p-4 rounded-lg border border-[#D7CCB9] mt-4"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="h-5 w-5 text-[#AF5F4B]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-[#2A5359] italic">
                  Your monthly contribution supports our yoga community and
                  helps maintain our sacred practice space. Receipts are sent
                  via email or whatsapp.
                </p>
              </div>
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white text-lg font-medium ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#78917D] hover:bg-[#6B816F]"
                } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#78917D]`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Generate Receipt"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Decorative yoga pose silhouettes */}
          <div className="flex justify-center mt-8 space-x-8 opacity-30">
            {/* Tree pose */}
            <svg className="h-12 w-12 fill-[#2A5359]" viewBox="0 0 50 50">
              <path d="M25,10 C27,10 29,12 29,14 C29,16 27,18 25,18 C23,18 21,16 21,14 C21,12 23,10 25,10 Z M25,18 L25,28 L28,28 L28,42 L26,42 L26,30 L24,30 L24,42 L22,42 L22,28 L25,28 Z M25,26 C23,23 20,28 17,28 C17,24 20,22 25,26 Z" />
            </svg>

            {/* Lotus pose */}
            <svg className="h-12 w-12 fill-[#78917D]" viewBox="0 0 50 50">
              <path d="M25,10 C27,10 29,12 29,14 C29,16 27,18 25,18 C23,18 21,16 21,14 C21,12 23,10 25,10 Z M25,20 L25,30 C20,25 15,30 15,35 C20,32 25,35 25,30 M25,20 L25,30 C30,25 35,30 35,35 C30,32 25,35 25,30" />
            </svg>

            {/* Warrior pose */}
            <svg className="h-12 w-12 fill-[#AF5F4B]" viewBox="0 0 50 50">
              <path d="M20,10 C22,10 24,12 24,14 C24,16 22,18 20,18 C18,18 16,16 16,14 C16,12 18,10 20,10 Z M20,18 L20,25 L15,40 L18,40 L22,28 L23,42 L26,42 L25,25 L30,40 L33,40 L27,20 Z" />
            </svg>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2A5359] mt-16 py-6 text-[#F5F0E6] relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 MokshaVidya YogaMandir</p>
              <p className="text-xs mt-1 opacity-70">
                Find balance. Find peace.
              </p>
            </div>

            <div className="flex space-x-4">
              {/* Social Icons */}
              {["facebook", "instagram", "twitter"].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-full bg-[#F5F0E6] bg-opacity-20 flex items-center justify-center"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm5 7.5h-3v2.5h3v7.5h-3V15H8v-5H5V7.5h3V5c0-1.9 1.6-3.5 3.5-3.5h3.5v6z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Mandala-inspired decorative element */}
          <div className="absolute left-4 bottom-4 opacity-30">
            <svg
              className="h-10 w-10 stroke-[#D7CCB9]"
              viewBox="0 0 50 50"
              fill="none"
              strokeWidth="1"
            >
              <circle cx="25" cy="25" r="12" />
              <circle cx="25" cy="25" r="8" />
              <circle cx="25" cy="25" r="4" />
              <line x1="25" y1="13" x2="25" y2="37" />
              <line x1="13" y1="25" x2="37" y2="25" />
              <line x1="17" y1="17" x2="33" y2="33" />
              <line x1="17" y1="33" x2="33" y2="17" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default YogaReceiptForm;
