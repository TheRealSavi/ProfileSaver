import { LuClipboardCopy } from "react-icons/lu";
import { Card } from "../types";
import { FaFolderPlus, FaTrash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { BiSolidErrorCircle } from "react-icons/bi";
import { useState } from "react";

interface CardInfoProps {
  onDelete?: () => void;
  onManageColl?: () => void;
  card: Card;
}

const CardInfo = (props: CardInfoProps) => {
  const [pcGlyph, setPcGlyph] = useState(<LuClipboardCopy />);
  const [acGlyph, setAcGlyph] = useState(<LuClipboardCopy />);

  const sendToClipboard = async (
    text: string,
    setGlyph: React.Dispatch<React.SetStateAction<JSX.Element>>
  ) => {
    const returnGlyph = () => {
      setGlyph(<LuClipboardCopy />);
    };
    try {
      const response = await window.electronAPI.invoke(
        "copy-to-clipboard",
        text
      );
      if (response == "complete") {
        setGlyph(<FaCheck />);
      } else {
        setGlyph(<BiSolidErrorCircle />);
      }
      setTimeout(returnGlyph, 2000);
    } catch (error) {
      setGlyph(<BiSolidErrorCircle />);
      setTimeout(returnGlyph, 2000);
    }
  };

  return (
    <div className="absolute sm:relative sm:right-0 right-4 sm:top-0 top-14 h-fit mt-2 bg-[#232428] rounded-r-md shadow-md p-4 z-10 max-w-fit">
      <h1 className="text-gray-200 text-md font-bold">Profile Theme</h1>
      <hr className="border-t-2 border-gray-500 my-3" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            className="rounded-md min-h-12 min-w-16 group"
            style={{ backgroundColor: props.card.primaryColor }}
            onClick={() => {
              sendToClipboard(props.card.primaryColor, setPcGlyph);
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-300 text-2xl flex justify-center items-center h-full shadow-md">
              {pcGlyph}
            </div>
          </button>
          <div>
            <p className="text-white">Primary</p>
            <p className="text-white font-bold">{props.card.primaryColor}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md min-h-12 min-w-16 group"
            style={{ backgroundColor: props.card.accentColor }}
            onClick={() => {
              sendToClipboard(props.card.accentColor, setAcGlyph);
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-300 text-2xl flex justify-center items-center h-full shadow-md">
              {acGlyph}
            </div>
          </button>
          <div>
            <p className="text-white">Accent</p>
            <p className="text-white font-bold">{props.card.accentColor}</p>
          </div>
        </div>
      </div>
      <h1 className="text-gray-200 text-md font-bold mt-3">Image Link</h1>
      <hr className="border-t-2 border-gray-500 my-1" />

      <button
        onClick={() => {
          if (props.card.getImagesFromID) {
            window.electronAPI.invoke(
              "open-saveid",
              props.card.getImagesFromID
            );
          }
        }}
        className="hover:underline font-semibold text-[#00a8fc] transition-all duration-200"
      >
        Open in explorer
      </button>
      <h1 className="text-gray-200 text-md font-bold mt-10">Manage</h1>
      <hr className="border-t-2 border-gray-500 my-1" />
      <div className="flex justify-center pt-2 gap-6">
        <button
          onClick={props.onManageColl}
          className="text-gray-200 text-xl hover:text-[#4752c4] transition-all duration-200"
        >
          <FaFolderPlus />
        </button>
        <button
          onClick={() => {
            window.electronAPI
              .invoke("delete-profile", props.card.getImagesFromID)
              .then((result) => {
                console.log(result);
              });
            if (props.onDelete) {
              props.onDelete();
            }
          }}
          className="text-gray-200 text-xl hover:text-[#da373c] transition-all duration-200"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CardInfo;
