import cancel from "../../assets/icons/cancel.svg";

export function handleModal(e) {
  e.preventDefault();

  //check which button has been clicked
  if (e.target.getAttribute("name") === "openModal") {
    //the modal is always next to the opening button
    const currentModal = e.target.nextElementSibling;
    currentModal.showModal();
  } else if (e.target.getAttribute("name") === "closeModal") {
    // the modal is always the closest ancestor of
    const currentModal = e.target.closest("dialog");
    currentModal.close();
  } else {
    //reload the page if name attribute is missing
    location.reload();
  }
}

export function Modal({ children }) {
  return (
    <dialog
      className="p-0 backdrop:bg-gray-700 backdrop:bg-opacity-90 rounded-lg w-[85vw]"
      onClick={(e) => {
        // only close the target if the actualy modal, and none of its child nodes, have been clicked
        try {
          e.target.close();
        } catch {
          return null;
        }
      }}
    >
      {" "}
      <div className="p-8">
        <img
          onClick={handleModal}
          className="-mt-4 -ml-4"
          name="closeModal"
          src={cancel}
          alt=""
        />
        {children}
      </div>
    </dialog>
  );
}
