import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { CollectionData } from "../types";

interface FolderViewerProps {
  handleOpenFolder: (arg0: CollectionData) => void;
  handleCreateNewFolder: (arg0: boolean) => void;
  refresher: boolean;
}

interface FolderButtonProps {
  handleClicked: (arg0: CollectionData) => void;
  folder: CollectionData;
  inDeleteMode: boolean;
}

const FolderViewer = (props: FolderViewerProps) => {
  const [folders, setFolders] = useState<CollectionData[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);

  const handleFolderClicked = (folder: CollectionData) => {
    if (!deleteMode) {
      props.handleOpenFolder(folder);
    } else {
      window.electronAPI.invoke("delete-collection", folder.id).then(() => {
        refresh();
      });
    }
  };

  const refresh = () => {
    window.electronAPI
      .invoke("get-all-collections")
      .then((data: CollectionData[]) => {
        setFolders(data);
      });
  };

  useEffect(() => {
    refresh();
  }, [props.refresher]);

  return (
    <div className="w-56 bg-[#111214] h-fit rounded-md p-3 shadow-md">
      <div className="flex justify-between items-center text-gray-200 font-bold text-xl">
        <h1>Collections</h1>
        <button
          onClick={() => {
            props.handleCreateNewFolder(true);
          }}
          className="text-gray-300 hover:text-white transition-all duration-200"
        >
          <FaPlus />
        </button>
        <button
          onClick={() => {
            setDeleteMode(!deleteMode);
          }}
          className={
            deleteMode
              ? "hover:text-[#a33636] text-[#da373c] transition-all duration-200"
              : "text-gray-300 hover:text-[#da373c] transition-all duration-200"
          }
        >
          <FaTrash />
        </button>
      </div>

      <hr className="border-t-2 border-gray-500 my-2" />

      {folders.map((folder, i) => {
        return (
          <div key={i}>
            <FolderButton
              handleClicked={handleFolderClicked}
              folder={folder}
              inDeleteMode={deleteMode}
            />
          </div>
        );
      })}
    </div>
  );
};

const FolderButton = (props: FolderButtonProps) => {
  return (
    <button
      onClick={() => {
        props.handleClicked(props.folder);
      }}
      className={
        props.inDeleteMode
          ? "p-2 flex items-center justify-between text-gray-300 hover:bg-[#da373c] hover:text-white font-semibold text-lg rounded-sm w-full transition-all duration-200"
          : "p-2 flex items-center justify-between text-gray-300 hover:bg-[#4752c4] hover:text-white font-semibold text-lg rounded-sm w-full transition-all duration-200"
      }
    >
      <p>{props.folder.content.name}</p>
      {props.inDeleteMode ? <FaTrash /> : <FaFolder />}
    </button>
  );
};

export default FolderViewer;
