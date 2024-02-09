import twitchImg from "../assets/twitchpng.png";
import spotifyImg from "../assets/spotify.png";
import steamImg from "../assets/steam-logo-white.png";
import boosterImg from "../assets/booster.png";
import nitroImg from "../assets/Nitro_badge.webp";
import balanceImg from "../assets/balance.png";
import knownAs from "../assets/icons8-hashtag-330.webp";
import { darken, desaturate, lighten } from "polished";
import tinycolor from "tinycolor2";
import { useEffect, useState } from "react";
import avatarImg from "../assets/discordblue.png";
import bannerImg from "../assets/banner.jpeg";

import { Card } from "../types";
import CardInfo from "./CardInfo";
import { AnimatePresence, motion } from "framer-motion";
import FolderManager from "./FolderManager";

interface ProfileCardProps {
  card: Card;
  canOpenDetails?: boolean;
  onDelete?: () => void;
}

const ProfileCard = (props: ProfileCardProps) => {
  const gradientStops = `${props.card.primaryColor || "#000000"}, ${
    props.card.accentColor || "#000000"
  }`;

  const brightness =
    tinycolor(props.card.primaryColor || "#000000").getBrightness() / 255;
  const brightMode = brightness >= 0.67;

  const primaryDark = brightMode
    ? lighten(0.2, desaturate(0.12, props.card.primaryColor || "#000000"))
    : darken(0.22, props.card.primaryColor || "#000000");
  const accentDark = brightMode
    ? lighten(0.2, desaturate(0.75, props.card.accentColor || "#000000"))
    : darken(0.2, props.card.accentColor || "#000000");
  const darkenedGradientStops = `${primaryDark}, ${accentDark}`;

  const [showingDetails, setShowingDetails] = useState(false);
  const [showingCollModal, setShowingCollModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    props.card.avatarUrl || avatarImg
  );
  const [bannerUrl, setBannerUrl] = useState<string>(
    props.card.bannerUrl || bannerImg
  );

  const handleResult = async (result: any) => {
    if (result.banner) {
      const burl = await window.electronAPI.invoke(
        "read-file-as-data-url",
        result.banner
      );
      setBannerUrl(burl);
    }
    if (result.avatar) {
      const aurl = await window.electronAPI.invoke(
        "read-file-as-data-url",
        result.avatar
      );
      setAvatarUrl(aurl);
    }
  };

  useEffect(() => {
    setAvatarUrl(props.card.avatarUrl ? props.card.avatarUrl : avatarUrl);
    setBannerUrl(props.card.bannerUrl ? props.card.bannerUrl : bannerUrl);
  }, [props]);

  useEffect(() => {
    if (props.card.getImagesFromID != undefined) {
      window.electronAPI
        .invoke("get-saveid-images", props.card.getImagesFromID)
        .then((result) => {
          handleResult(result);
        });
    }
  }, []);

  return (
    <div className="flex z-10">
      <button
        onClick={() => {
          if (props.canOpenDetails) {
            console.log(!showingDetails);
            setShowingDetails(!showingDetails);
            setShowingCollModal(false);
          }
        }}
        className="flex items-center justify-center overflow-hidden shadow-md rounded-md border-4 border-gradient-to-b min-w-[24rem] max-w-[24rem] h-fit text-left z-10"
        style={{ "--tw-gradient-stops": gradientStops } as React.CSSProperties}
      >
        <div className="w-full ">
          <div className="w-full h-32">
            <img
              src={bannerUrl}
              alt="User Banner"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="bg-gradient-to-b p-1 w-full darken"
            style={
              {
                "--tw-gradient-stops": darkenedGradientStops,
              } as React.CSSProperties
            }
          >
            <div className="flex">
              <div className="-mt-16 ml-3">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full border-4"
                  style={{ borderColor: primaryDark }}
                />
              </div>
            </div>

            <div className="-mt-6 mr-3 flex justify-end">
              <div
                className={
                  brightMode
                    ? "flex gap-2 h-7 bg-opacity-50 rounded-md p-1 bg-white"
                    : "flex gap-2 h-7 bg-opacity-40 rounded-md p-1 bg-black"
                }
              >
                <img src={balanceImg}></img>
                <img src={nitroImg}></img>
                <img src={boosterImg}></img>
                <img src={knownAs}></img>
              </div>
            </div>

            <div
              className={
                brightMode
                  ? "flex bg-white bg-opacity-50 rounded-md m-3"
                  : "flex bg-black bg-opacity-50 rounded-md m-3"
              }
            >
              <div
                className={
                  brightMode ? "p-3 text-black w-full" : "p-3 text-white w-full"
                }
              >
                <h2 className="text-lg font-bold">{props.card.name}</h2>
                <h2 className="text-sm font-semibold">{props.card.username}</h2>

                <hr
                  className={
                    brightMode
                      ? "border-t-2 border-gray-300 my-2"
                      : "border-t-2 border-gray-500 my-2"
                  }
                />

                <h2 className="text-xs font-bold">ABOUT ME</h2>
                <div
                  className={
                    brightMode
                      ? "mt-1 text-xs text-gray-800"
                      : "mt-1 text-xs text-gray-300"
                  }
                >
                  {props.card.aboutMe?.split("\n").map((line, index) => (
                    <div key={index}>
                      <p className="break-all">{line}</p>
                    </div>
                  ))}
                </div>

                <h2 className="text-xs font-bold mt-3">DISCORD MEMBER SINCE</h2>
                <p
                  className={
                    brightMode
                      ? "mt-1 text-xs text-gray-800"
                      : "mt-1 text-xs text-gray-300"
                  }
                >
                  {new Date(
                    props.card.createdUnix ? props.card.createdUnix : Date.now()
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                <h2 className="text-xs font-bold mt-3">CONNECTIONS</h2>
                <div className="flex gap-3 h-8 mt-2 mb-1">
                  <img src={spotifyImg}></img>
                  <img src={steamImg}></img>
                  <img src={twitchImg}></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
      <div className="-z-[0]">
        <AnimatePresence>
          {showingDetails && (
            <motion.div
              key={"card-details-" + props.card.getImagesFromID}
              layoutId={"card-details-" + props.card.getImagesFromID}
              initial={{ x: "-100%" }} // Initial position to the left of the viewport
              animate={{ x: 0 }} // Animate to the center
              exit={{ x: "-100%" }} // Animate to the left when exiting
              transition={{
                type: "spring",
                stiffness: 95,
                damping: 14,
              }}
            >
              <CardInfo
                card={{ ...props.card }}
                onDelete={props.onDelete}
                onManageColl={() => {
                  setShowingCollModal(!showingCollModal);
                }}
              />
            </motion.div>
          )}
          {showingCollModal && props.card.getImagesFromID && showingDetails && (
            <motion.div
              key={"coll-det-" + props.card.getImagesFromID}
              className="z-50"
              initial={{ y: "-50%" }}
              animate={{ y: 0 }}
              exit={{ y: "-50%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 195,
                damping: 24,
              }}
            >
              <FolderManager
                profileId={props.card.getImagesFromID}
              ></FolderManager>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileCard;
