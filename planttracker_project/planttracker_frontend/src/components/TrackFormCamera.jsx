import cam from '../assets/icons/cam.svg';
export default function TrackFormCamera() {
  const camControl = document.querySelector('#cam');
  const video = document.querySelector('video');

  function activateCam (e) {
    e.preventDefault();
    video.classList.toggle('hidden');
    camControl.classList.toggle('hidden');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia() not supported.');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(function (stream) {
        if ('srcObject' in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function (e) {
          video.play();
        };
        const photoButton = document.querySelector('.take_photo');
        photoButton.addEventListener("click", async (e) => {
          e.preventDefault();
          const imageCapture = await new ImageCapture(stream.getTracks()[0]);
          imageCapture.takePhoto().then((blob) => {
            const img = document.querySelector(".blob");
            img.src = URL.createObjectURL(blob);
            console.log(img.src);
            stream.getTracks().forEach(track => track.stop());
            video.classList.toggle('hidden');
            
            

          });

        });
        
        // add button to switch between front and back camera
        // const constraints = { video: { facingMode: "environment" } };

      })

      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  };

  return (
    <div id="camcontainer">
      <button id="cam" onClick={activateCam}>Cam</button>
      <video className="hidden"></video>
      <button className="take_photo">
        <img
          height="20px"
          width="20px"
          src={cam}
          alt=""
        />
      </button>

      <div id="imageSrc">
        <img src="" className="blob" alt="" />
      </div>
    </div>
  );
}