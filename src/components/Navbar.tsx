import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoMdReturnLeft } from "react-icons/io";
import { FaFolder } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";
import SettingsModal from "./SettingsModal";

interface NavbarProps {
  handleChevronClicked: (chevronState: boolean) => void;
  returnToAllClicked: () => void;
  handleCreateNewClicked: () => void;
  handleRefresh: () => void;
  chevronOpen: boolean;
  folderName?: string;
}

const Navbar = (props: NavbarProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const propagateRefresh = () => {
    props.handleRefresh();
  };

  return (
    <div className="h-12 bg-[#25262a] w-full">
      <div className="h-full flex justify-between items-center p-4 gap-3 text-center font-bold text-xl">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setShowSettings(!showSettings);
            }}
            className="text-gray-300 hover:text-white font-bold text-xl transition-all duration-200 mr-5"
          >
            <FaGear />
          </button>
          <div>
            {props.folderName && (
              <button
                onClick={() => {
                  props.returnToAllClicked();
                }}
                className="text-gray-300 hover:text-white font-bold text-xl pr-5 transition-all duration-200"
              >
                <p>All Profiles</p>
                <IoMdReturnLeft />
              </button>
            )}
          </div>

          {props.folderName && (
            <div className="text-gray-300">
              <FaFolder />
            </div>
          )}

          <div
            className={
              showSettings
                ? "absolute top-10 animated visible"
                : "absolute top-10 animated"
            }
          >
            <SettingsModal
              handleRefresh={propagateRefresh}
              handleDismal={() => {
                setShowSettings(false);
              }}
            />
          </div>

          <button
            onClick={() => {
              props.handleChevronClicked(!props.chevronOpen);
            }}
            className="text-gray-300 hover:text-white transition-all duration-200"
          >
            {props.folderName ? props.folderName : "All Profiles"}
          </button>

          <button
            className="text-gray-300 hover:text-white transition-all duration-200"
            onClick={() => {
              props.handleChevronClicked(!props.chevronOpen);
            }}
          >
            {props.chevronOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        <button
          onClick={() => {
            props.handleCreateNewClicked();
          }}
          className="text-gray-300 hover:text-white transition-all duration-200"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
