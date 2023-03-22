import axios from "../api/axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogout = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});

    try {
      // eslint-disable-next-line
      const response = await toast.promise(
        axios("/api/logout", {
          withCredentials: true,
        }),
        {
          pending: "Attempting to sign out...",
          success: "Successfully signed out!",
          error: "Something went wrong",
        }
      );
      navigate("/logout");
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default useLogout;
