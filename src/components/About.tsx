import { IoLogoGithub } from "react-icons/io";
import { FaYoutube } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

interface aboutProps {
  onClose: () => void;
}

const About = (props: aboutProps) => {
  return (
    <div>
      <div className="flex flex-col place-items-end bg-black bg-opacity-50 rounded-lg">
        <button
          onClick={props.onClose}
          className="text-gray-300 hover:text-white mt-2 text-2xl font-extrabold bg-red-400 rounded-full transition-all duration-200 mr-2"
        >
          <IoCloseOutline></IoCloseOutline>
        </button>
        <div className="bg-[#25262a] text-white px-2 m-2 rounded-lg h-52 w-96 min-w-max max-h-min z-40 font-bold text-lg text-center drop-shadow-xl">
          <p className="pt-2 text-[#6e79f0]">Discord Profile Saver</p>
          <hr className="rounded-lg p-2 mt-2"></hr>
          <p className="text-base font-semibold">Built by John Gibbons</p>
          <div className="flex justify-between p-2">
            <button
              className="flex items-center gap-1 underline duration-200 transition-all text-gray-200 hover:text-[#00a8fc]"
              onClick={() => {
                window.electronAPI.invoke("open-github-repo");
              }}
            >
              <IoLogoGithub />
              <p className="text-base font-semibold">GitHub</p>
            </button>
            <button
              className="flex items-center gap-1 underline duration-200 transition-all text-gray-200 hover:text-[#00a8fc]"
              onClick={() => {
                window.electronAPI.invoke("open-yt");
              }}
            >
              <FaYoutube />
              <p className="text-base font-semibold">YouTube</p>
            </button>
          </div>

          <p className="text-base font-semibold text-gray-400">v1.0.3</p>
          <p className="text-xs fixed bottom-2 p-2 text-gray-400 italic">
            "You have power over your mind — not outside events. Realize this,
            and you will find strength." - Marcus Aurelius
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
