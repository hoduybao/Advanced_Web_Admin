import { Button, notification } from "antd";
import React, { useState } from "react";
import ApiUser from "../../utils/api/user";
import { useDispatch } from "react-redux";
import { login } from "../store/admin/userSlice";
import { useNavigate } from "react-router-dom";
const Context = React.createContext({
  name: "Default",
});
export default function Login() {
  const [api] = notification.useNotification();
  const dispact = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [signin, setSignin] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  let success = true;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignin((prevInputs) => ({ ...prevInputs, [name]: value }));

    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `Please input your ${name}!`,
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  const handleLogin = (event) => {
    event.preventDefault();

    // Validate inputs
    const newErrors = {};
    if (!signin.email) {
      newErrors.email = "Please input your email!";
      success = false;
    }

    if (!signin.password) {
      newErrors.password = "Please input your password!";
      success = false;
    }

    // Handle form submission logic
    if (success) {
      setLoading(true);
      const fetch = async () => {
        let response = await ApiUser.postLogin(`user/login`, {
          email: signin.email,
          password: signin.password,
        });
        setLoading(false);

        if (response.success) {
          dispact(
            login({
              isLoggin: true,
              token: response.accessToken,
            })
          );
          navigate("/");
        } else {
          api.error({
            message: `Login falied!`,
            description: (
              <Context.Consumer>
                {() => `Username or password is incorrect!`}
              </Context.Consumer>
            ),
            placement: "topRight",
          });
          setErrors(newErrors);
        }
      };
      fetch();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-[45%] bg-white rounded-2xl border shadow-2xl  left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[460px]">
        <h3 className="py-3 bg-purple-900 rounded-t-2xl text-white font-medium text-center text-lg">
          Login to Admin Dashboard BTH Classroom
        </h3>
        <div className="p-8 text-sm flex flex-col">
          <label>Username</label>
          <input
            value={signin.email}
            onChange={handleChange}
            name="email"
            type="text"
            className="pl-2 mt-1 p-[6px] rounded-md border outline-none border-gray-300  focus:border-purple-900"
          ></input>
          {errors.email && (
            <span className="text-red-500 mt-[2px]">{errors.email}</span>
          )}
          <label className="mt-4">Password</label>
          <input
            value={signin.password}
            onChange={handleChange}
            name="password"
            type="password"
            className=" pl-2 mt-1 p-[6px] rounded-md border border-gray-300 outline-none  focus:border-purple-900"
          ></input>
          {errors.password && (
            <span className="text-red-500 mt-[2px]">{errors.password}</span>
          )}

          <Button
            loading={loading}
            onClick={handleLogin}
            className="bg-purple-800 cursor-pointer !text-white rounded py-[6px] min-h-[38px]  text-base mt-6 flex justify-center !border-none"
          >
            LOGIN
          </Button>
        </div>
      </div>
    </div>
  );
}
