"use client";
import bgVideoNew from "@/public/video/bgVideoNew.mp4";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { toast } from "react-toastify";
import { z } from "zod";
import { LOGIN_API } from "../../APIs";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import { AxiosError, ErrorResponse } from "../../services/api-client";

const schema = z.object({
  username: z.string().min(1, { message: "Please add Username!" }),
  password: z.string().min(1, { message: "Please add Password!" }),
});

export type Login = z.infer<typeof schema>; // this interface is for form data

export interface UserData {
  id: number;
  userName: string;
  email: string;
}

interface UserProfile {
  department_Id: number;
  firstName: string;
  lastName: string;
}

interface Props {
  responseCode: number;
  responseMessage: string;
  data: {
    token: string;
    expiration: string;
    role: [string];
    rights: { rightName: string }[];
    userData: UserData;
    userProfile: UserProfile;
  };
}

const Login = () => {
  // const [userName, setUserName] = useState("super_admin");
  // const [password, setPassword] = useState("Rtmes@1122");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({ resolver: zodResolver(schema) });
  const [buttonType, setButtonType] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isCookiesSaved, setCookiesSaved] = useState(false);
  const [activePrivacyLink, setActivePrivacyLink] = useState(false);
  const [isClient, setClient] = useState(false);

  const createdMessage = "Logged In Successfully!";
  const errorMessage = "Username or Password is not Correct!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  useEffect(() => {
    setClient(true);
  }, []);

  const onSubmit = async (formData: Login) => {
    console.log("Form Data:", formData);
    console.log("API call", process.env.NEXT_PUBLIC_BACKEND_API + LOGIN_API);
    console.log("API call", LOGIN_API);

    try {
      setSubmitting(true);
      const response = await axios.post<Props>(
        // LOGIN_API,
        process.env.NEXT_PUBLIC_BACKEND_API + LOGIN_API,
        formData,
      );

      if (response.data.responseCode === 200) {
        console.log("responseCode", response.data.responseCode);
        console.log("responseMessage", response.data.responseMessage);
        console.log("user logged in successfully", response);
        // console.log("token: ", response.data.data.token);
        // const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now
        // if (Cookies.get("token")) Cookies.remove("token");
        // if (Cookies.get("email")) Cookies.remove("email");
        // if (Cookies.get("userName")) Cookies.remove("userName");
        // if (Cookies.get("userId")) Cookies.remove("userId");
        // if (Cookies.get("role")) Cookies.remove("role");
        // if (Cookies.get("rights")) Cookies.remove("rights");
        if (!isCookiesSaved) {
          setCookiesSaved(true);
          Cookies.set("token", response.data.data.token, {
            expires: new Date(response.data.data.expiration),
          });
          Cookies.set("userName", response.data.data.userData.userName, {
            expires: new Date(response.data.data.expiration),
          });
          Cookies.set("userId", response.data.data.userData.id.toString(), {
            expires: new Date(response.data.data.expiration),
          });
          Cookies.set("email", response.data.data.userData.email, {
            expires: new Date(response.data.data.expiration),
          });
          Cookies.set(
            "departmentId",
            response.data.data.userProfile.department_Id.toString(),
            {
              expires: new Date(response.data.data.expiration),
            },
          );
          Cookies.set(
            "deptUserFirstName",
            response.data.data.userProfile.firstName,
            {
              expires: new Date(response.data.data.expiration),
            },
          );
          Cookies.set(
            "deptUserLastName",
            response.data.data.userProfile.lastName,
            {
              expires: new Date(response.data.data.expiration),
            },
          );
          console.log("role", response.data.data.role);
          if (response.data.data.role.length > 0) {
            Cookies.set("role", response.data.data.role[0], {
              expires: new Date(response.data.data.expiration),
            });
          }
          console.log(
            "rights",
            response.data.data.rights.map((rights) => rights.rightName),
          );
          if (response.data.data.rights.length > 0) {
            Cookies.set(
              "rights",
              JSON.stringify(
                response.data.data.rights.map((rights) => rights.rightName),
              ),
              {
                expires: new Date(response.data.data.expiration),
              },
            );
          }
        }

        window.location.href = "/";
        notifyCreate(createdMessage);
      } else {
        notifyError(response.data.responseMessage);
      }
    } catch (err) {
      setSubmitting(false);
      console.log(err);
      notifyError(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          errorMessage,
      );
    } finally {
      setSubmitting(false); // Always run after try/catch
    }
  };

  return (
    <>
      {isClient && (
        <>
          <video
            autoPlay
            loop
            muted
            style={{
              position: "fixed",
              right: "0",
              bottom: "0",
              minWidth: "100%",
              minHeight: "100%",
              zIndex: "1",
            }}
          >
            <source src={bgVideoNew} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 1,
            }}
          ></div>
          <div
            className="container"
            style={{
              position: "relative",
              zIndex: "2",
            }}
          >
            <div className="row d-flex justify-content-center">
              <div
                className="col-xl-5 col-lg-7 col-md-8 col-sm-12 bg-blur-3"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  position: "fixed",
                  padding: "60px 50px",
                  borderRadius: "25px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                <div className="row m-0">
                  <div
                    className="col text-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <Image
                      src="/icons/logoNew1.svg"
                      className="img-fluid"
                      style={{ filter: "drop-shadow(0px 0px .75px green)" }}
                      alt="logo"
                      width={110}
                      height={980}
                    />
                  </div>
                </div>
                <h3
                  className="text-white fw-6 text-center"
                  style={{ marginBottom: "20px" }}
                >
                  Directorate General Monitoring & Evaluation
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div
                    className="row d-flex justify-content-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="col">
                      {/* <label htmlFor="username" className="form-label text-white">
                    User ID
                  </label> */}
                      <div className="input-group mb-1">
                        {/* <span
                      className="input-group-text border-0"
                      id="basic-addon1"
                      style={{ background: "rgba(255, 255, 255, 0.7)" }}
                    >
                      <Image
                        src={userGrey}
                        alt="userGrey"
                        width={17}
                        height={17}
                        style={{
                          color: "#7e7e7e !important",
                        }}
                      />
                      <Image
                        src={verticalLineGrey}
                        alt="verticalLineGrey"
                        width={17}
                        height={17}
                      />
                    </span> */}
                        <input
                          {...register("username")}
                          type="text"
                          className="form-control border-0 m-0 fs-6 login-input"
                          placeholder="Enter User ID"
                          style={{
                            background: "rgba(255, 255, 255, 0.7)",
                          }}
                          id="username"
                          autoComplete="username"
                        />
                      </div>
                      {errors.username && (
                        <ErrorMessage>{errors.username.message}</ErrorMessage>
                      )}
                    </div>
                  </div>
                  <div
                    className="row d-flex justify-content-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="col">
                      {/* <label htmlFor="password" className="form-label text-white">
                    Password
                  </label> */}
                      <div className="input-group mb-1 position-relative">
                        {/* <span
                      className="input-group-text border-0"
                      id="basic-addon1"
                      style={{ background: "rgba(255, 255, 255, 0.7)" }}
                    >
                      <Image
                        src={passwordGrey}
                        alt="password"
                        width={17}
                        height={17}
                      />
                      <Image
                        src={verticalLineGrey}
                        alt="verticalLineGrey"
                        width={17}
                        height={17}
                      />
                    </span> */}
                        <input
                          {...register("password")}
                          type={buttonType === true ? "password" : "text"}
                          className="form-control border-0 m-0 fs-6 login-input"
                          style={{
                            background: "rgba(255, 255, 255, 0.7)",
                          }}
                          placeholder="Enter your Password"
                          id="password"
                          autoComplete="current-password"
                        />
                        <Button
                          className="btn position-absolute rounded-pill"
                          style={{ top: 15, zIndex: 3, right: 5 }}
                          type="button"
                          onClick={() => setButtonType(!buttonType)}
                        >
                          {buttonType ? (
                            <TbEyeClosed size={20} />
                          ) : (
                            <FaRegEye size={20} />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                      )}
                    </div>
                  </div>
                  {/* <div className="form-check" style={{ marginBottom: "20px" }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label
                  className="form-check-label text-white fs14px fw-5 "
                  htmlFor="rememberMe"
                >
                  Remember Me
                </label>
              </div> */}
                  <div className="row d-flex flex-colum justify-content-center mb-3">
                    <div className="col">
                      <Button
                        type="submit"
                        style={{
                          borderRadius: "6px",
                          background: `${
                            isSubmitting
                              ? "linear-gradient(to right, #8cbbde , #6e8799)"
                              : "linear-gradient(to right, #0C8CE9 , #13629B)"
                          }`,
                          letterSpacing: 1,
                          padding: "20px 26px",
                        }}
                        className="btn shadow text-white w-100 fw-bold rounded-pill "
                        disabled={isSubmitting}
                      >
                        LOGIN {isSubmitting && <Spinner color="text-light" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      className={`w-100 fw-5 fs14px ${
                        activePrivacyLink
                          ? "text-white"
                          : "text-decoration-none color-sea-blue "
                      }`}
                      onMouseEnter={() => setActivePrivacyLink(true)}
                      onMouseLeave={() => setActivePrivacyLink(false)}
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
