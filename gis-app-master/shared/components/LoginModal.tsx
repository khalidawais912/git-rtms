"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import Button from "./Button";

const LoginModal = () => {
  const postRoute = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/Authentication/login`;
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = axios.post(postRoute, {
        userName,
        password,
      });
      console.log("user logged in successfully", response);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <>
      <Button
        type="button"
        className="btn btn-sm text-white"
        data-bs-toggle="modal"
        data-bs-target="#loginModal"
      >
        Login
      </Button>

      <div
        className="modal fade"
        id="loginModal"
        aria-labelledby="loginModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
                style={{
                  backgroundImage:
                    "linear-gradient(to left, #969696 ,#e3e3e3 )",
                  borderRadius: "20px",
                }}
              >
                <form onSubmit={handleSumbit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="btn btn-primary">
                    Submit
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
