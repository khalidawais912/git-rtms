"use client";

interface Props {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error }: Props) => {
  console.error("Error", error);
  return (
    <>
      <div>An unexpected error has occurred.</div>;
    </>
  );
};

export default ErrorPage;
