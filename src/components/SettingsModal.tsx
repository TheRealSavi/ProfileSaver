import { useEffect, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { UserSettings } from "../types";

interface CNFModalProps {
  handleDismal: (arg0: boolean) => void;
  handleRefresh: () => void;
}

const SettingsModal = (props: CNFModalProps) => {
  const [settings, setSettings] = useState<UserSettings>();

  useEffect(() => {
    getSettings();
  }, []);

  const getSettings = () => {
    window.electronAPI.invoke("read-settings").then((result: UserSettings) => {
      setSettings(result);
    });
  };

  const saveSettings = () => {
    window.electronAPI.invoke("save-settings", JSON.stringify(settings));
    props.handleDismal(false);
  };

  return (
    <div className="w-56 bg-[#111214] h-fit rounded-md p-3 shadow-md text-left">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-200 font-bold text-xl"> Settings</h1>
        <button
          onClick={() => {
            props.handleRefresh();
            props.handleDismal(false);
          }}
          className="text-gray-300 hover:text-white font-bold text-xl transition-all duration-200"
        >
          <LuRefreshCw />
        </button>
      </div>
      <hr className="border-t-2 border-gray-500 my-3" />
      <h1 className="text-gray-300 text-sm font-bold pt-2 pb-1">
        Default Import User ID
      </h1>
      <input
        className="text-white text-sm p-2 w-full rounded-sm font-bold bg-[#383a40]"
        value={settings?.defaultImportID || ""}
        onChange={(e) => {
          setSettings({
            ...settings,
            defaultImportID: e.target.value,
          } as UserSettings);
        }}
      ></input>

      <h1 className="text-gray-300 text-sm font-bold pb-1 pt-3">
        Discord Bot Token
      </h1>

      <input
        className="text-white text-sm p-2 w-full rounded-sm font-bold bg-[#383a40]"
        value={settings?.botToken || ""}
        onChange={(e) => {
          setSettings({
            ...settings,
            botToken: e.target.value,
          } as UserSettings);
        }}
      ></input>
      <button
        className=" text-xs hover:underline font-semibold text-[#00a8fc] transition-all duration-200 "
        onClick={() => {
          window.electronAPI.invoke("open-discord-portal");
        }}
      >
        Get one here
      </button>

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
          onClick={() => {
            saveSettings();
          }}
          className="p-2 pl-4 pr-4 flex items-center justify-between text-white bg-[#2eaf5c] hover:bg-[#1a6334]  font-semibold text-lg rounded-md transition-all duration-200"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
