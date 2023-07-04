import { useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import { Modal, handleModal } from "../../elements/Modal";
import AnimationLoading from "../../elements/AnimationLoading";
import ChangePassword from "./Subcomponents/ChangePassword";
import DeleteAccount from "./Subcomponents/DeleteAccount";
import Submissions from "./Subcomponents/Submissions";
import UpdateEmail from "./Subcomponents/UpdateEmail";
import ScrollTile from "../../elements/TileXL";

const classes = {
  title: "",
  paragraph: "",
  button: "",
  dangerbutton: "",
  cancelbutton: "",
  dangertext: "",
  message: "",
  buttonwrapper: "flex space-4",
  dangercancelbutton: "",
};

export default function Account() {
  const [user, setUser] = useState();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("accounts/me/")
      //backend filters out the right user
      .then((res) => {
        const user = res.data;
        setUser(user);
        axiosInstance
          .get(`api/locations?author=${user.id}`)
          .then((res) => {
            setSubmissions(res.data);
            setLoading(false);
            console.log(submissions);
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [changes]);

  return loading ? (
    <AnimationLoading>
      <p>Loading...</p>
    </AnimationLoading>
  ) : (
    <div>
      <ScrollTile>
        <h3 className={classes.title}>My account settings</h3>
        <div>
          <p className={classes.paragraph}>Username</p>
          {user && <p>{user.username}</p>}
        </div>
        {/* Email */}
        <div>
          <p className={classes.paragraph}>Email</p>
          {user && <p className={classes.paragraph}>{user.email}</p>}
          <button
            className={classes.button}
            name="openModal"
            onClick={handleModal}
          >
            Update
          </button>
          {/* Change email */}
          <Modal>
            <UpdateEmail props={{ changes, setChanges }} />
          </Modal>
        </div>
        {/* Password change */}
        <div>
          <button
            className={classes.button}
            onClick={handleModal}
            name="openModal"
          >
            Change password
          </button>
          <Modal>
            <ChangePassword />
          </Modal>

          {/* Delete account */}
          <div>
            <button
              className={classes.button}
              name="openModal"
              onClick={handleModal}
            >
              Delete account
            </button>
            <Modal>
              <DeleteAccount />
            </Modal>
          </div>
        </div>
      </ScrollTile>
      <ScrollTile>
        <Submissions props={{ submissions }} />
      </ScrollTile>
    </div>
  );
}
