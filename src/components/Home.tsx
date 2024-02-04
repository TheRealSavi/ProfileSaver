import { useState } from "react";
import Navbar from "./Navbar";
import FolderViewer from "./FolderViewer";

import CreateNewFolderModal from "./CreateNewFolderModal";
import CardList from "./CardList";
import { CollectionData } from "../types";

interface HomeProps {
  handleCreateNewClicked: () => void;
}

const Home = (props: HomeProps) => {
  const [showFolderViewer, setShowFolderViewer] = useState(false);
  const [inFolder, setInFolder] = useState<CollectionData>();
  const [showCreateNewFolder, setShowCreateNewFolder] = useState(false);
  const [refresher, setRefresher] = useState(false);

  const displayFolderViewer = (isVisible: boolean) => {
    setShowFolderViewer(isVisible);
  };

  const enterFolder = (folder: CollectionData) => {
    setInFolder(folder);
    setShowFolderViewer(false);
  };

  const handleShowCNF = (isVisible: boolean) => {
    setShowCreateNewFolder(isVisible);
    setShowFolderViewer(false);
  };

  const createNewClicked = () => {
    props.handleCreateNewClicked();
  };

  const handleRefresh = () => {
    setRefresher(!refresher);
    setInFolder(undefined);
    console.log(refresher);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <Navbar
          handleRefresh={handleRefresh}
          handleChevronClicked={displayFolderViewer}
          handleCreateNewClicked={createNewClicked}
          returnToAllClicked={() => {
            setInFolder(undefined);
          }}
          chevronOpen={showFolderViewer}
          folderName={inFolder?.content.name}
        />
      </div>

      <div
        className={
          showFolderViewer
            ? "absolute z-50 top-12 ml-3 animated visible"
            : "absolute z-50 top-12 ml-3 animated"
        }
      >
        <FolderViewer
          refresher={refresher}
          handleOpenFolder={enterFolder}
          handleCreateNewFolder={handleShowCNF}
        />
      </div>

      <div
        className={
          showCreateNewFolder
            ? "absolute z-50 top-12 ml-3 animated visible"
            : "absolute z-50 top-12 ml-3 animated"
        }
      >
        <CreateNewFolderModal handleDismal={handleShowCNF} />
      </div>

      <div className="flex flex-col flex-grow-1 p-4 h-full">
        <div className="flex sm:items-center h-full">
          <CardList refresher={refresher} collection={inFolder} />
        </div>
      </div>
    </div>
  );
};

export default Home;
