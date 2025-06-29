import { Camera } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

function WebCam({ setSelectedAvatar }) {
  const [editing, setEditing] = useState(false);
  const [cameraAvatar, setCameraAvatar] = useState(null);
  const [filename, setFilename] = useState("");
  const { register, watch } = useFormContext();
  const avatarFile = watch("avatar");

  function handleImageClick() {
    setEditing(false);
    setSelectedAvatar(cameraAvatar);
  }

  return (
    <div className="flex flex-wrap items-center">
      {editing ? (
        <div>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          >
            {({ getScreenshot }) => (
              <div className="flex gap-5 justify-center mt-3">
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    const imageSrc = getScreenshot();
                    if (imageSrc) {
                      setSelectedAvatar(imageSrc);
                      setCameraAvatar(imageSrc);
                      setFilename(imageSrc.split("/").pop());
                    }
                    setEditing(false);
                  }}
                >
                  Capture photo
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </Webcam>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 items-center">
          {cameraAvatar && (
            <label
              htmlFor={filename}
              className="flex flex-col items-center cursor-pointer"
            >
              <img
                src={cameraAvatar}
                alt="avatar"
                className={`w-16 h-16 rounded-full border-2 ${
                  avatarFile?.name === filename
                    ? "border-cyan-500"
                    : "border-transparent"
                }`}
                onClick={handleImageClick}
              />
              {avatarFile?.name === filename && (
                <p className="text-sm text-cyan-700">Selected</p>
              )}
              <input
                type="radio"
                value={filename}
                {...register("avatar")}
                className="hidden"
              />
            </label>
          )}

          <button
            type="button"
            className="btn"
            onClick={() => setEditing(true)}
          >
            <Camera />
          </button>
        </div>
      )}
    </div>
  );
}

export default WebCam;
