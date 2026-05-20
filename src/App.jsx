import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Trash2,
} from "lucide-react";

export default function App() {
  const [text, setText] = useState("");
  const [corrected, setCorrected] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // LIVE AI CHECK
  useEffect(() => {
    if (!text.trim()) {
      setCorrected("");
      setDisplayed("");
      return;
    }

    const timer = setTimeout(() => {
      checkGrammar();
    }, 600);

    return () => clearTimeout(timer);
  }, [text]);

  // API CALL
  const checkGrammar = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5001/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCorrected("API limit reached");
        return;
      }

      setCorrected(data.corrected);

    } catch (error) {
      console.log(error);
      setCorrected("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  // AI TYPE EFFECT
  useEffect(() => {
    if (!corrected) return;

    let i = 0;

    setDisplayed("");

    const interval = setInterval(() => {
      setDisplayed(corrected.slice(0, i));
      i++;

      if (i > corrected.length) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);

  }, [corrected]);

  // COPY
  const handleCopy = async () => {
    await navigator.clipboard.writeText(corrected);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // CLEAR
  const handleClear = () => {
    setText("");
    setCorrected("");
    setDisplayed("");
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-amber-400/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
        

      
      
        </motion.div>

        {/* MAIN GRID */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >

          {/* INPUT PANEL */}
          <motion.div
            whileHover={{
              scale: 1.01,
            }}
            className="bg-white/5 border border-yellow-500/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-semibold">
                Your Text
              </h2>

              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing here..."
              className="w-full h-[350px] bg-black/40 border border-white/10 rounded-2xl p-6 text-lg outline-none resize-none focus:border-yellow-400/50 transition duration-300 placeholder:text-white/30"
            />

            {/* FOOTER */}
            <div className="flex items-center justify-between mt-4">

              <p className="text-sm text-white/40">
                {text.length} characters
              </p>

              <button
                onClick={handleClear}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
              >
                <Trash2 size={16} />
                Clear
              </button>

            </div>

          </motion.div>

          {/* OUTPUT PANEL */}
          <motion.div
            whileHover={{
              scale: 1.01,
            }}
            className="bg-white/5 border border-green-500/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          >

            {/* LIVE GLOW */}
            <motion.div
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-green-500/5 pointer-events-none"
            />

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-semibold">
                AI Corrected
              </h2>

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="px-4 py-1 rounded-full bg-green-500/20 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
              >

                <div className="w-2 h-2 rounded-full bg-green-400"></div>

                Live AI

              </motion.div>

            </div>

            <div className="h-[350px] bg-black/40 border border-white/10 rounded-2xl p-6 overflow-auto relative">

              <AnimatePresence mode="wait">

                {loading ? (

                  <motion.div
                    key="loading"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="flex items-center gap-3"
                  >

                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-white/70">
                      AI is enhancing your writing...
                    </p>

                  </motion.div>

                ) : (

                  <motion.div
                    key="text"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="relative"
                  >

                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">

                      {displayed || "Your corrected text will appear here..."}

                    </p>

                    {/* BLINKING CURSOR */}
                    {displayed && (
                      <span className="inline-block w-[2px] h-5 bg-green-400 ml-1 animate-pulse"></span>
                    )}

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end mt-4">

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-medium hover:scale-105 active:scale-95 transition"
              >

                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}

              </button>

            </div>

          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}