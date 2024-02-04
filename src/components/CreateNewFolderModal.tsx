import { useState } from "react";

interface CNFModalProps {
  handleDismal: (arg0: boolean) => void;
}

const CreateNewFolderModal = (props: CNFModalProps) => {
  const [inputData, setInputData] = useState("");

  const handleClickedSave = () => {
    window.electronAPI.invoke("create-collection", {
      name: inputData,
    });
    props.handleDismal(false);
  };

  return (
    <div className="w-56 bg-[#111214] h-fit rounded-md p-3 shadow-md">
      <h1 className="text-gray-300 text-lg font-bold pb-2"> Collection Name</h1>

      <input
        onChange={(e) => {
          setInputData(e.target.value);
        }}
        value={inputData}
        className="text-white text-lg p-2 w-full rounded-sm font-bold bg-[#383a40]"
      ></input>

      <div className="flex justify-between pt-4">
        <button
          className="p-2 flex items-center justify-between text-[#da373c] hover:bg-[#da373c] hover:text-white font-semibold text-lg rounded-md transition-all duration-200"
          onClick={() => {
            props.handleDismal(false);
          }}
        >
          Dismiss
        </button>
        <button
          onClick={handleClickedSave}
          className="p-2 pl-4 pr-4 flex items-center justify-between text-white bg-[#2eaf5c] hover:bg-[#1a6334]  font-semibold text-lg rounded-md transition-all duration-200"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateNewFolderModal;
