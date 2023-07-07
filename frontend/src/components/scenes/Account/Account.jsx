import { useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import { Modal, handleModal } from "../../elements/Modal";
import AnimationLoading from "../../elements/AnimationLoading";
import ChangePassword from "./Subcomponents/ChangePassword";
import DeleteAccount from "./Subcomponents/DeleteAccount";
import Submissions from "./Subcomponents/Submissions";
import UpdateEmail from "./Subcomponents/UpdateEmail";
import TileXL from "../../elements/TileXL";
import Tile from "../../elements/Tile";
const classes = {
  wrapper: "flex flex-col h-[90vh] justify-center items-center",
  wrapperxl: "mt-6 space-y-6 last:mb-6"
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

    <div className={classes.wrapper}>
      <Tile>
      <AnimationLoading>
      <p>Loading...</p>
    </AnimationLoading>
      </Tile>
    </div>

  ) : (
    <div className={classes.wrapperxl}>
      <TileXL>
        <h3>My account settings</h3>
        <div>
          <p>Username</p>
          {user && <p>{user.username}</p>}
        </div>
        {/* Email */}
        <div>
          <p>Email</p>
          {user && <p>{user.email}</p>}
          <button
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
      </TileXL>
      <TileXL>
        <Submissions props={{ submissions }} />
      </TileXL>
    </div>
  );
}
