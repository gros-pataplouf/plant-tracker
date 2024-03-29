import { useEffect, useState } from "react";
import axiosInstance from "../../../helpers/axios";
import AnimationLoading from "../../elements/AnimationLoading";
import { useOutletContext } from "react-router-dom";
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
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();

  useEffect(() => {
    if (!isLoggedIn) {
      window.alert("You need to be logged in to access your account.");
      return (window.location.href = `/login?${window.location.href
        .replaceAll("/", " ")
        .trim()
        .split(" ")
        .at(-1)}`);
    }

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
  }, [changes, isLoggedIn]);

  return loading ? (
    <div className="wrapper-tile">
      <Tile>
        <AnimationLoading>
          <p>Loading...</p>
        </AnimationLoading>
      </Tile>
    </div>
  ) : (
    <div className="mt-6 space-y-6 last:mb-6 lg:px-96 lg:[&>*>*]:m-4">
      <TileXL>
        <h1 className="my-6">My account settings</h1>
        <table className="[&>tbody>tr]:h-12 text-3xl">
          <tbody>
            <tr>
              <td>Username:</td>
              <td>{user && user.username}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{user && user.email}</td>
            </tr>
            <tr>
              <td>
                <button
                  className="text-3xl text-emerald-900"
                  name="openModal"
                  onClick={handleModal}
                >
                  Update email
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
                <button
                  onClick={handleModal}
                  className="text-3xl text-emerald-900"
                  name="openModal"
                >
                  Change password
                </button>
                <Modal>
                  <ChangePassword />
                </Modal>
              </td>
            </tr>
            {/* Delete account */}
            <tr>
              <td>
                <button
                  className="text-3xl text-red-800"
                  name="openModal"
                  onClick={handleModal}
                >
                  Delete account
                </button>
                <Modal>
                  <DeleteAccount />
                </Modal>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </TileXL>
      <TileXL>
        <Submissions props={{ submissions }} />
      </TileXL>
    </div>
  );
}
