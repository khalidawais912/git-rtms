import BackButton from "./not-authorized/components/BackButton";
import HomeButton from "./not-authorized/components/HomeButton";

const NotFoundPage = () => {
  return (
    <div
      className={`container`}
      style={{
        position: "relative",
        zIndex: "2",
      }}
    >
      <div className="row d-flex justify-content-center">
        <div
          className="col"
          style={{
            position: "fixed",
            padding: "60px 50px",
            borderRadius: "25px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <p className="m-0 text-center fs-4 fw-bold color-evaluation-theme-blue">
            404 Error
          </p>
          <h1
            className="fw-8 text-center"
            style={{ fontSize: "72px", marginBottom: "32px" }}
          >
            Oops! We Can&apos;t Find That Page.
          </h1>
          <p className="text-center fs-5 mb-5">
            Unfortunately, the page you&apos;re looking page is gone or has been
            moved :&#40;
          </p>
          <div className="row d-flex gap-2 justify-content-center">
            <BackButton />
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
