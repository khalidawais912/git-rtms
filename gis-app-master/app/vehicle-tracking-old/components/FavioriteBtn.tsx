import Button from "@/app/components/Button";
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

const FavioriteBtn = () => {
  const [favorite, setFavorite] = useState(false);
  return (
    <Button
      className="btn p-0"
      onClick={() => setFavorite(!favorite)}
      style={{
        outline: "none",
        boxShadow: "none",
      }}
    >
      {favorite ? (
        <GoHeartFill
          className="color-sea-blue"
          style={{ width: "21", height: "18" }}
        />
      ) : (
        <GoHeart
          className="color-sea-blue"
          style={{ width: "21", height: "18" }}
        />
      )}
    </Button>
  );
};

export default FavioriteBtn;
