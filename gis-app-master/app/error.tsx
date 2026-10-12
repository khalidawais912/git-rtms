"use client";

interface Props {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error, reset }: Props) => {
  console.log("Error", error);
  return (
    <>
      <div>An unexpected error has occurred.</div>;
      {/* <Button className="btn" onClick={() => reset()}>
        Retry
      </Button> */}
    </>
  );
};

export default ErrorPage;
