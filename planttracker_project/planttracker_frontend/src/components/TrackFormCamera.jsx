import { useEffect, useState } from 'react';
import cancel from '../assets/icons/cancel.svg';
import ok from '../assets/icons/ok.svg';
import takephoto from '../assets/icons/takephoto.svg';
import turncam from '../assets/icons/turncam.svg';

export default function TrackFormCamera({props}) {
    const {image, setImage, cam, setCam} = props;
    const camControl = document.querySelector('#cam');
    let video;
    let photo;
    //initialize stream to make it globally available
    let [camStream, setCamStream] = useState();
    useEffect(() => {
      activateCam()
    }, [cam])

//refactor 
// when user clicks on activateCam button form all other input fields are hidden
// when user clicks on take photo button video stream stops, input fields appear again, 


    function activateCam () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia() not supported.');
            return;
        }
        navigator.mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then(function (stream) {
          // update video bc element now rendered
            video = document.querySelector('video');
            photo = document.querySelector('#photoContainer');
            if ("srcObject" in video) {
                video.srcObject = stream;
            } else {
            video.src = window.URL.createObjectURL(stream);
            }
            video.onloadedmetadata = function (e) {
            video.play();
            };
            camStream = stream;            
        // add button to switch between front and back camera
        // const constraints = { video: { facingMode: "environment" } };

          })

        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
    };

    async function takePhoto(e) {
        const imageCapture = await new ImageCapture(camStream.getTracks()[0]);
        imageCapture.takePhoto().then((blob) => {
          setCam('photo');
          photo.style.display = "block";
          video.style.display = "none";
          const img = document.querySelector(".blob");
          img.src = URL.createObjectURL(blob);
          setImage(blob);

        });
      };
    function cancelCam() {
      if (cam === 'photo') {
        video.style.display = "block";
        photo.style.display = "none";
        setCam('stream');
      }
      else {
        camStream.getTracks().forEach(track => track.stop());
        setCam(false);
  
      }
    };

    function turnCam(e) {
      return null;

    };
    function confirmPhoto(e) {
      camStream.getTracks().forEach(track => track.stop());
      setImage(new File([image], 'webcam.png', {'type':'image/png'}));
      setCam(false);


    };
    
  




  return (
    <div id="camcontainer">
       
      <video></video>
      <div id='photoContainer' style={{display:'none'}}>
        <img src="" className="blob" alt="" />
      </div>
      {/* command palette */}
      <div>
      <button onClick={cancelCam}>
        <img
          height="20px"
          width="20px"
          src={cancel}
          alt=""
        />
      </button>
      {cam !== 'photo' &&
            <button onClick={turnCam}>
            <img
              height="20px"
              width="20px"
              src={turncam}
              alt=""
            />
          </button>
      }

      {cam === 'photo'? 
      <button onClick={confirmPhoto}>
        <img
          height="20px"
          width="20px"
          src={ok}
          alt=""
        />
      </button> : 
      <button onClick={takePhoto}>
        <img
          height="20px"
          width="20px"
          src={takephoto}
          alt=""
        />
      </button>}
      </div>

    </div>
  );
}