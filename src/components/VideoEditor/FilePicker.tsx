'use client';

const FilePicker = () => {
  async function handleClick() {
    const file = await window.electron.dialog.openVideo();

    console.log(file);
  }
  return (
    <button
      className='border-white border p-3 rounded-lg hover:bg-gray-500 hover:text-black'
      onClick={handleClick}
    >
      Open video
    </button>
  );
};

export default FilePicker;
