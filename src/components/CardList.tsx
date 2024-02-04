import ProfileCard from "./ProfileCard";
import { useEffect, useState } from "react";
import { TfiGithub } from "react-icons/tfi";
import { CollectionData } from "../types";
import { CardData } from "../types";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

interface CardListProps {
  refresher: boolean;
  collection?: CollectionData;
}

const CardList = (props: CardListProps) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refresh();
  }, [props.refresher, props.collection]);

  const refresh = async () => {
    setIsLoading(true);

    const profiles: CardData[] = await window.electronAPI.invoke(
      "get-all-profiles"
    );
    if (props.collection) {
      console.log(props.collection);
      setCards(
        profiles.filter((card) => {
          return props.collection?.content.profiles?.includes(card.id);
        })
      );
      setIsLoading(false);
    } else {
      setCards(profiles);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        isLoading || cards.length == 0
          ? ""
          : "sm:overflow-x-scroll w-full overflow-hidden"
      }
    >
      <div
        className={
          isLoading
            ? "animated visible flex items-center gap-2"
            : "animated flex items-center gap-2"
        }
      >
        <p className="text-4xl text-white font-bold">Loading profiles...</p>
        <div className=" text-4xl text-white font-bold animate-bounce">
          <TfiGithub />
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-5 pb-5">
        {cards.length == 0 && !isLoading && (
          <p className="text-2xl text-white font-bold">
            {props.collection
              ? "The collection is empty"
              : "Add your first profile by clicking + in top right"}
          </p>
        )}
        <AnimatePresence mode="sync">
          <LayoutGroup>
            {!isLoading &&
              cards
                .sort((a, b) => {
                  if (!b.content.createdUnix) {
                    return -1;
                  }
                  if (!a.content.createdUnix) {
                    return 1;
                  }
                  return (
                    parseInt(b.content.createdUnix || "0", 10) -
                    parseInt(a.content.createdUnix || "0", 10)
                  );
                })
                .map((card) => {
                  return (
                    <motion.div
                      layout="preserve-aspect"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={card.id}
                      layoutId={card.id}
                    >
                      <ProfileCard
                        card={{
                          primaryColor: card.content.primaryColor,
                          accentColor: card.content.accentColor,
                          name: card.content.name,
                          username: card.content.username,
                          aboutMe: card.content.aboutMe,
                          getImagesFromID: card.id,
                          createdUnix: card.content.createdUnix,
                        }}
                        canOpenDetails={true}
                        onDelete={refresh}
                      ></ProfileCard>
                    </motion.div>
                  );
                })}
          </LayoutGroup>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardList;
