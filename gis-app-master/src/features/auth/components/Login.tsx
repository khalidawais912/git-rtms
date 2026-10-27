"use client";
import bgVideoNew from "@/public/video/bgVideoNew.mp4";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Spinner from "@/components/Spinner";
import { AxiosError } from "@/services/client";
import { ErrorResponse } from "@/services/types";
import { saveSession } from "@/utils/session";
import { LoginFormData, loginSchema } from "../schema";
import { login } from "../services";
import { LoginData } from "../types";
import styles from "./Login.module.css";

const SUCCESS_MESSAGE = "Logged In Successfully!";
const ERROR_MESSAGE = "Username or Password is not Correct!";

/** Saves the login response as session cookies, all expiring with the token. */
const saveLoginSession = (data: LoginData) =>
  saveSession(
    {
      token: data.token,
      userName: data.userData.userName,
      userId: data.userData.id.toString(),
      email: data.userData.email,
      departmentId: data.userProfile.department_Id.toString(),
      deptUserFirstName: data.userProfile.firstName,
      deptUserLastName: data.userProfile.lastName,
      role: data.role[0],
      rights: data.rights.length
        ? JSON.stringify(data.rights.map(({ rightName }) => rightName))
        : undefined,
    },
    new Date(data.expiration),
  );

/** Backend's message for HTTP errors or a refused login, else the default message. */
const getErrorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    return (
      (err.response?.data as ErrorResponse | undefined)?.responseMessage ||
      ERROR_MESSAGE
    );
  }
  return (err instanceof Error && err.message) || ERROR_MESSAGE;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [activePrivacyLink, setActivePrivacyLink] = useState(false);
  const [isClient, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  const onSubmit = async (formData: LoginFormData) => {
    setSubmitting(true);
    try {
      saveLoginSession(await login(formData));
      toast.success(SUCCESS_MESSAGE);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <>
      <video autoPlay loop muted className={styles.video}>
        <source src={bgVideoNew} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <div className={styles.overlay}></div>
      <div className={`container ${styles.wrapper}`}>
        <div className="row d-flex justify-content-center">
          <div
            className={`col-xl-5 col-lg-7 col-md-8 col-sm-12 bg-blur-3 ${styles.card}`}
          >
            <div className="row m-0">
              <div className={`col text-center ${styles.section}`}>
                <Image
                  src="/icons/logoNew1.svg"
                  className={`img-fluid ${styles.logo}`}
                  alt="logo"
                  width={110}
                  height={980}
                  priority
                />
              </div>
            </div>
            <h3 className={`text-white fw-6 text-center ${styles.section}`}>
              Directorate General Monitoring & Evaluation
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className={`row d-flex justify-content-center ${styles.section}`}
              >
                <div className="col">
                  <div className="input-group mb-1">
                    <input
                      {...register("username")}
                      type="text"
                      className={`form-control border-0 m-0 fs-6 login-input ${styles.input}`}
                      placeholder="Enter User ID"
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
                className={`row d-flex justify-content-center ${styles.section}`}
              >
                <div className="col">
                  <div className="input-group mb-1 position-relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className={`form-control border-0 m-0 fs-6 login-input ${styles.input}`}
                      placeholder="Enter your Password"
                      id="password"
                      autoComplete="current-password"
                    />
                    <Button
                      className={`btn position-absolute rounded-pill ${styles.eyeButton}`}
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <FaRegEye size={20} />
                      ) : (
                        <TbEyeClosed size={20} />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                  )}
                </div>
              </div>
              <div className="row d-flex justify-content-center mb-3">
                <div className="col">
                  <Button
                    type="submit"
                    className={`btn shadow text-white w-100 fw-bold rounded-pill ${styles.submitButton}`}
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
                      : "text-decoration-none color-sea-blue"
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
  );
};

export default Login;
