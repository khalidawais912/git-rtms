import Image from "next/image";
import { useState } from "react";
import search2 from "../../../public/icons/search2.svg";

const SearchBar = () => {
  const [visitId, setVisitId] = useState(0);
  return (
    <div className="row">
      <div className="col fw-bold" style={{ fontSize: "1.5rem" }}>
        Maps
      </div>
      <div className="col">
        <div className="row d-flex justify-content-center mb-2">
          <div className="col">
            <div className="input-group">
              <span
                className="input-group-text pe-0 border-0 rounded-end rounded-pill"
                id="basic-addon1"
                style={{ background: "#E0EEFC" }}
              >
                <Image
                  src={search2}
                  alt="search2"
                  width={20}
                  height={20}
                  style={{
                    color: "#7e7e7e !important",
                  }}
                />
              </span>
              <input
                type="number"
                className="form-control border-0 rounded-start rounded-pill p-3"
                style={{ background: "#E0EEFC" }}
                id="username"
                placeholder="Search by Visit Id"
                onChange={(e) => setVisitId(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
