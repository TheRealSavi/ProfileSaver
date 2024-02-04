interface FSBProps {
  name: string;
  onFilePicked: (arg0: string) => void;
}

const FileSelectorButton = (props: FSBProps) => {
  const handleOpenDialog = async () => {
    try {
      const result = await window.electronAPI.invoke("select-file");
      if (result) {
        const dataUrl = await window.electronAPI.invoke(
          "read-file-as-data-url",
          result
        );
        props.onFilePicked(dataUrl);
      }
      console.log("Selected File:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button
      className="p-2 px-6 flex items-center justify-between bg-[#5360e5] hover:bg-[#4752c4] text-white font-semibold text-lg rounded-sm w-fit transition-all duration-200"
      onClick={handleOpenDialog}
    >
      {props.name}
    </button>
  );
};

export default FileSelectorButton;
