import { FaRegTimesCircle } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { ChromePicker, ColorResult } from "react-color";
import { useEffect, useState } from "react";
import FileSelectorButton from "./FileSelectorButton";

import avatarImg from "../assets/discordblue.png";
import bannerImg from "../assets/banner.jpeg";
import { Card } from "../types";
import { UserSettings } from "../types";
import ProfileCard from "./ProfileCard";

interface CreateNewProps {
  handleEsc: () => void;
}

const CreateProfile = (props: CreateNewProps) => {
  const [showPCP, setShowPCP] = useState(false);
  const [showACP, setShowACP] = useState(false);
  const [pc, setPc] = useState("#3C5EB7");
  const [ac, setAc] = useState("#3A98A6");
  const [importID, setImportID] = useState("");
  const [profileData, setProfileData] = useState({
    primaryColor: pc,
    accentColor: ac,
    avatarUrl: avatarImg,
    bannerUrl: bannerImg,
    name: "Discord User",
    username: "Discord User",
    aboutMe: "Hello",
  } as Card);
  const [pfpDataType, setPfpDataType] = useState<string | undefined>(undefined);
  const [bannerDataType, setBannerDataType] = useState<string | undefined>(
    undefined
  );
  const [settings, setSettings] = useState<UserSettings>();

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    setImportID(settings?.defaultImportID || "");
  }, [settings]);

  const getSettings = () => {
    window.electronAPI.invoke("read-settings").then((result: UserSettings) => {
      setSettings(result);
    });
  };

  const getProfileDataFromDUID = async (userID: string) => {
    const data = await window.electronAPI.invoke("fetch-discord-user", userID);

    const afe = data.avatar?.startsWith("a_") ? "gif" : "png";
    const bfe = data.banner?.startsWith("a_") ? "gif" : "png";

    if (data.avatar) {
      setPfpDataType(afe);
    } else {
      setPfpDataType(undefined);
    }

    if (data.banner) {
      setBannerDataType(bfe);
    } else {
      setBannerDataType(undefined);
    }

    const newProfileData = {
      primaryColor: data.banner_color
        ? data.banner_color
        : profileData.primaryColor,
      accentColor: data.accent_color
        ? "#" + data.accent_color.toString(16)
        : profileData.accentColor,
      name: data.global_name,
      username: data.username,
      avatarUrl: data.avatar
        ? `https://cdn.discordapp.com/avatars/${userID}/${data.avatar}.${afe}?size=1024&quality=lossless&width=0&height=281`
        : profileData.avatarUrl,
      bannerUrl: data.banner
        ? `https://cdn.discordapp.com/banners/${userID}/${data.banner}.${bfe}?size=1024&width=0&height=281`
        : profileData.bannerUrl,
    } as Card;

    setProfileData({ ...profileData, ...newProfileData });
    setAc(newProfileData.accentColor);
    setPc(newProfileData.primaryColor);
  };

  const handleSave = async () => {
    const storeToID = await window.electronAPI.invoke("allocate-new-profile");
    await window.electronAPI.invoke(
      "save-image",
      storeToID,
      profileData.avatarUrl,
      pfpDataType ? "avatar." + pfpDataType : "avatar"
    );

    await window.electronAPI.invoke(
      "save-image",
      storeToID,
      profileData.bannerUrl,
      bannerDataType ? "banner." + bannerDataType : "banner"
    );

    const json = JSON.stringify({
      primaryColor: pc,
      accentColor: ac,
      name: profileData.name,
      username: profileData.username,
      aboutMe: profileData.aboutMe,
      createdUnix: Date.now(),
    });
    await window.electronAPI.invoke("save-json", storeToID, json);
    await new Promise((resolve) => setTimeout(resolve, 500));
    props.handleEsc();
  };

  return (
    <div>
      <div className="flex justify-end mr-10 mt-5">
        <button
          onClick={() => {
            props.handleEsc();
          }}
        >
          <div className="flex flex-col justify-center items-center text-gray-300 hover:text-white text-4xl gap-1 transition-all duration-200">
            <FaRegTimesCircle />
            <p className="text-sm">ESC</p>
          </div>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-8 mx-4 sm:mx-20">
        <div className="flex flex-col w-fit m-1">
          <h1 className="text-gray-300 text-md font-bold pb-2">Display Name</h1>
          <input
            className="text-white text-lg p-2 rounded-sm font-bold bg-[#1e1f22]"
            value={profileData.name}
            onChange={(e) => {
              setProfileData({ ...profileData, name: e.target.value });
            }}
          ></input>
          <hr className="border-t-2 border-gray-500 my-6" />
          <h1 className="text-gray-300 text-md font-bold pb-2"> Avatar</h1>
          <FileSelectorButton
            name="Change Avatar"
            onFilePicked={(path) => {
              setProfileData({ ...profileData, avatarUrl: path });
              setPfpDataType(undefined);
            }}
          />
          <hr className="border-t-2 border-gray-500 my-6" />
          <h1 className="text-gray-300 text-md font-bold pb-2">
            Profile Banner
          </h1>
          <FileSelectorButton
            name="Change Banner"
            onFilePicked={(path) => {
              setProfileData({ ...profileData, bannerUrl: path });
              setBannerDataType(undefined);
            }}
          />
          <hr className="border-t-2 border-gray-500 my-6" />
          <h1 className="text-gray-300 text-md font-bold pb-2">
            Profile Theme
          </h1>
          <div className="flex gap-5 text-gray-300 w-full">
            <div className="flex flex-col items-center">
              <button
                style={{ backgroundColor: pc }}
                onClick={() => {
                  setShowPCP(!showPCP);
                }}
                className="p-1 flex justify-end hover:text-2xl text-white font-semibold text-lg rounded-md h-12 w-16 transition-all duration-200"
              >
                <div className="shadow-sm">
                  <RiPencilFill />
                </div>
              </button>
              <p>Primary</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                style={{ backgroundColor: ac }}
                onClick={() => {
                  setShowACP(!showACP);
                }}
                className="p-1 flex justify-end hover:text-2xl text-white font-semibold text-lg rounded-md h-12 w-16 transition-all duration-200"
              >
                <div className="shadow-sm">
                  <RiPencilFill />
                </div>
              </button>
              <p>Accent</p>
            </div>
          </div>
          <hr className="border-t-2 border-gray-500 my-6" />
          <h1 className="text-gray-300 text-md font-bold pb-2">About Me</h1>
          <textarea
            rows={6}
            className="text-white text-sm p-2 mb-16 rounded-sm font-bold bg-[#1e1f22] h-28"
            style={{ resize: "none" }}
            defaultValue={profileData.aboutMe}
            onChange={(e) => {
              setProfileData({ ...profileData, aboutMe: e.target.value });
            }}
          ></textarea>
        </div>

        {showPCP && (
          <ColorInput
            dColor={pc}
            onUpdate={(color) => {
              setPc(color);
            }}
            onClose={() => {
              setShowPCP(false);
            }}
          />
        )}
        {showACP && (
          <ColorInput
            dColor={ac}
            onUpdate={(color) => {
              setAc(color);
            }}
            onClose={() => {
              setShowACP(false);
            }}
          />
        )}

        <div className="absolute left-0 bottom-8 flex place-content-center w-full pointer-events-none">
          <div
            className={
              profileData.avatarUrl != avatarImg
                ? // && profileData.bannerUrl != bannerImg
                  "bg-[#111214] p-2 px-3 rounded-lg shadow-lg flex items-center gap-3 w-fit pointer-events-auto animated visible"
                : "bg-[#111214] p-2 px-3 rounded-lg shadow-lg flex items-center gap-3 w-fit pointer-events-auto animated"
            }
          >
            <p className="text-white">Careful - you have unsaved changes!</p>
            <button
              onClick={() => {
                handleSave();
              }}
              className="p-2 pl-4 pr-4 flex items-center justify-between text-white bg-[#2eaf5c] hover:bg-[#1a6334]  font-semibold text-lg rounded-md transition-all duration-200"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 pb-36">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-300 text-xs font-bold">PREVIEW</h1>
            <ProfileCard
              card={
                {
                  avatarUrl: profileData.avatarUrl,
                  bannerUrl: profileData.bannerUrl,
                  primaryColor: pc,
                  accentColor: ac,
                  name: profileData.name,
                  username: profileData.username,
                  aboutMe: profileData.aboutMe,
                } as Card
              }
            ></ProfileCard>
          </div>

          <div className="flex gap-2">
            <div
              className={
                settings?.botToken
                  ? "flex flex-col gap-1"
                  : "flex flex-col gap-1 cursor-not-allowed"
              }
            >
              <div
                className={
                  settings?.botToken
                    ? "flex-grow-0"
                    : "flex-grow-0 opacity-15 pointer-events-none"
                }
              >
                <h1 className="text-gray-300 text-md font-bold pb-2">
                  Import with User ID
                </h1>
                <div className="flex gap-3">
                  <input
                    className="text-white text-lg p-2 rounded-sm font-bold bg-[#1e1f22]"
                    value={importID}
                    onChange={(e) => {
                      setImportID(e.target.value);
                    }}
                  ></input>
                  <button
                    onClick={() => {
                      getProfileDataFromDUID(importID);
                    }}
                    className="p-1 pl-4 pr-4 flex items-center justify-between text-white bg-[#2eaf5c] hover:bg-[#1a6334]  font-semibold text-lg rounded-md transition-all duration-200 w-fit"
                  >
                    Import
                  </button>
                </div>
              </div>
              <div className="flex-grow-0">
                {settings?.botToken ? (
                  <div>
                    <p className="text-[#b5bac1] text-xs">
                      Only grabs profile picture, banner, name, and username
                    </p>
                    <p className="text-[#bb5757] text-sm font-bold">
                      !! The colors grabbed will not be your nitro colors !!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[#bb5757] text-sm font-bold">
                      !! No bot token, enter one in settings. !!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ColorInputProps {
  onClose: () => void;
  onUpdate: (arg0: string) => void;
  dColor: string;
}

const ColorInput = (props: ColorInputProps) => {
  const [color, setColor] = useState(props.dColor);

  const onClose = () => {
    props.onClose();
  };

  const onUpdate = (e: ColorResult) => {
    setColor(e.hex);
    props.onUpdate(e.hex);
  };

  return (
    <div className="absolute z-50 mt-24 shadow-lg">
      <div
        className="fixed top-0 left-0 right-0 bottom-0"
        onClick={() => {
          onClose();
        }}
      ></div>
      <ChromePicker
        color={color}
        onChange={(e) => {
          onUpdate(e);
        }}
      ></ChromePicker>
    </div>
  );
};

export default CreateProfile;
