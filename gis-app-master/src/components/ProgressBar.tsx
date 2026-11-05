import { motion } from "framer-motion";

interface Props {
  value: number;
}

const ProgressBar = ({ value }: Props) => {
  return (
    <div className="col">
      <div
        className="progress rounded rounded-pill mt-1"
        style={{ height: "10px" }}
      >
        <motion.div
          className="progress-bar rounded rounded-pill"
          style={{
            width: `${value}%`,
            backgroundImage: "linear-gradient(to right, #0C8CE9 , #1A67A0)",
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          initial={{ width: "0%" }}
          whileInView={{ width: `${value}%` }}
          transition={{
            duration: 1,
            ease: "easeIn",
          }}
          viewport={{ once: true }} // Automatically triggers only once when in view
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
