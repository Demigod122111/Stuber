import { useState } from "react";
import { UpdateUserData } from "../modules/misc";

const DriverRating = ({ onSelectClose, onSubmit }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 w-screen">
        <div className="bg-gray-800 text-white rounded-lg p-6 max-w-lg w-2/1 relative flex flex-col justify-center items-center">
          <button
            onClick={() => onSelectClose()}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-4">Rate Your Driver</h2>
          <p className="text-gray-300">
            How was your ride? Please rate your driver below.
          </p>
          <div key="stars" className="flex justify-center m-5">
            {[1, 2, 3, 4, 5].map((rating, index) => (
              <button
                className={
                  index <= selectedIndex
                    ? "text-4xl m-2 text-yellow-400"
                    : "text-4xl m-2"
                }
                key={rating}
                onClick={() => setSelectedIndex(index)}
              >
                &#9733;
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              onSelectClose();
              onSubmit(selectedIndex + 1);
            }}
            className={selectedIndex === -1 ? "px-4 py-2 bg-blue-600 rounded inline-block opacity-60" : "px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 inline-block"}
            disabled={selectedIndex === -1}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverRating;
