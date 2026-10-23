import Image from "next/image";
import minus from "../../public/icons/minus.svg";
import plus from "../../public/icons/plus.svg";
import Button from "./Button";

interface Props {
  handleIncrement: () => void;
  handleDecrement: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
  text: string;
  name: string;
}

const Counter = ({
  handleIncrement,
  handleDecrement,
  onChange,
  text,
  name,
  value,
}: Props) => {
  return (
    <>
      <label htmlFor={name} className="form-label text-white">
        {text}
      </label>
      <div className="row bg-light d-flex rounded-pill m-1">
        <div className="col ps-1 pt-1 pb-1">
          <Button
            className="btn bg-color-sea-green rounded rounded-pill p-0"
            type="button"
            onClick={handleDecrement}
          >
            <Image
              className="p-1"
              src={minus}
              alt="minus"
              width={25}
              height={20}
            />
          </Button>
        </div>
        <div className="col p-0 d-flex align-items-center justify-content-center">
          <input
            type="number"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="form-control form-control-sm color-light-dark p-0 sortId text-center border-0 bg-light"
          />
        </div>
        <div className="col text-end pe-1 pt-1 pb-1">
          <Button
            className="btn bg-color-sea-green rounded rounded-pill p-0"
            type="button"
            onClick={handleIncrement}
          >
            <Image
              src={plus}
              alt="plus"
              className="p-1"
              width={25}
              height={20}
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Counter;
