import "./index.css";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import CreateProfile from "./components/CreateProfile";
import Home from "./components/Home";

declare global {
  interface Window {
    electronAPI: {
      invoke: (arg0: any, arg1?: any, arg2?: any, arg3?: any) => Promise<any>; // Adjust the return type as needed
    };
  }
}

function App() {
  const [creatingNew, setCreatingNew] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#313338] overflow-y-scroll overflow-hidden">
      <AnimatePresence mode="sync">
        {creatingNew ? (
          <motion.div
            key="create-page"
            initial={{ scale: 1.2, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 15, // controls the spring animation, higher values = less springiness
              stiffness: 100, // controls the spring animation, higher values = more stiffness
              duration: 0.1, // duration of the entire animation
            }}
          >
            <CreateProfile
              handleEsc={() => {
                setCreatingNew(false);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home-page"
            initial={{ scale: 0.8, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 15, // controls the spring animation, higher values = less springiness
              stiffness: 100, // controls the spring animation, higher values = more stiffness
              duration: 1, // duration of the entire animation
            }}
          >
            <Home
              handleCreateNewClicked={() => {
                setCreatingNew(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
