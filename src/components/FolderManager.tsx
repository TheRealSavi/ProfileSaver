import { useEffect, useState } from "react";
import { IoCheckboxOutline } from "react-icons/io5";
import { IoCheckbox } from "react-icons/io5";
import { CollectionData } from "../types";

interface FolderManagerProps {
  profileId: string;
}

const FolderManager = (props: FolderManagerProps) => {
  return (
    <div>
      <FolderViewer profileId={props.profileId} />
    </div>
  );
};

interface FolderButtonProps {
  handleClicked: (arg0: FolderButton) => void;
  folder: FolderButton;
}

interface FolderButton {
  folder: CollectionData;
  checked: boolean;
}

const FolderViewer = ({ profileId }: { profileId: string }) => {
  const [folders, setFolders] = useState<FolderButton[]>([]);
  const [collections, setCollections] = useState<CollectionData[]>([]);

  useEffect(() => {
    window.electronAPI
      .invoke("get-all-collections")
      .then((data: CollectionData[]) => {
        setCollections(data);
      });
  }, []);

  useEffect(() => {
    resolveCollectionStatus();
  }, [collections]);

  const resolveCollectionStatus = async () => {
    const newFolders = [] as FolderButton[];

    // Use map to create an array of promises
    const promises = collections.map(async (collection) => {
      const data: boolean = await window.electronAPI.invoke(
        "is-in-collection",
        profileId,
        collection.id
      );
      const folder = { folder: collection, checked: data } as FolderButton;
      newFolders.push(folder);
    });

    // Wait for all promises to resolve before setting the state
    await Promise.all(promises);

    setFolders(newFolders);
  };

  const handleClickFolder = (folder: FolderButton) => {
    window.electronAPI.invoke(
      "modify-profile-in-collection",
      profileId,
      folder.folder.id,
      !folder.checked
    );
    setFolders((prevFolders) =>
      prevFolders.map((ref) =>
        ref === folder ? { ...ref, checked: !ref.checked } : ref
      )
    );
  };

  return (
    <div className="w-56 bg-[#111214] h-fit rounded-md p-3 shadow-md">
      <div className="flex justify-between items-center text-gray-200 font-bold text-xl">
        <h1>Collections</h1>
      </div>

      <hr className="border-t-2 border-gray-500 my-2" />

      {folders.map((folder, i) => {
        return (
          <div key={i}>
            <FolderButton handleClicked={handleClickFolder} folder={folder} />
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
        props.folder.checked
          ? "p-2 flex items-center justify-between text-gray-300 hover:bg-gray-700 hover:text-white font-semibold text-lg rounded-sm w-full transition-all duration-200"
          : "p-2 flex items-center justify-between text-gray-300 hover:bg-gray-700 hover:text-white font-semibold text-lg rounded-sm w-full transition-all duration-200"
      }
    >
      <p>{props.folder.folder.content.name}</p>
      <div
        className={
          props.folder.checked
            ? "font-bold text-[#62d183] text-2xl "
            : "font-bold text-gray-300 text-2xl"
        }
      >
        {props.folder.checked ? <IoCheckbox /> : <IoCheckboxOutline />}
      </div>
    </button>
  );
};
export default FolderManager;
