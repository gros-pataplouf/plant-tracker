import { useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import AnimationLoading from "../../elements/AnimationLoading";
import { Modal, handleModal } from "../../elements/Modal";
import Tile from "../../elements/Tile";
import TileXL from "../../elements/TileXL";
import ChangePassword from "./Subcomponents/ChangePassword";
import DeleteAccount from "./Subcomponents/DeleteAccount";
import Submissions from "./Subcomponents/Submissions";
import UpdateEmail from "./Subcomponents/UpdateEmail";

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
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [changes]);

  return loading ? (
    <div className="wrapper-tile">
      <Tile>
        <AnimationLoading>
          <p>Loading...</p>
        </AnimationLoading>
      </Tile>
    </div>
  ) : (
    <div className="mt-6 space-y-6 last:mb-6">
      <TileXL>
        <h1 className="my-6">My account settings</h1>
        <table className="h-48 [&>tr]:border-b-2 border-slate-500">
          <tr>
            <td>Username:</td>
            <td>{user && user.username}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{user && user.email}</td>
            <td>
              <button name="openModal" onClick={handleModal}>
                Update
              </button>
              {/* Change email */}
              <Modal>
                <UpdateEmail props={{ changes, setChanges }} />
              </Modal>
            </td>
          </tr>

          {/* Password change */}
          <tr>
            <td>
              <button onClick={handleModal} name="openModal">
                Change password
              </button>
              <Modal>
                <ChangePassword />
              </Modal>
            </td>
          </tr>
          {/* Delete account */}
          <tr className="border-none">
            <td>
              <button name="openModal" onClick={handleModal}>
                Delete account
              </button>
              <Modal>
                <DeleteAccount />
              </Modal>
            </td>
          </tr>
        </table>
      </TileXL>
      <TileXL>
        <Submissions props={{ submissions }} />
      </TileXL>
    </div>
  );
}
