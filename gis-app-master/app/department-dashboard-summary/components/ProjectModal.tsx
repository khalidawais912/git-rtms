import Button from "@/app/components/Button";
import Image from "next/image";
import ProjectModalContent from "./ProjectModalContent";
import ProjectTab from "./ProjectTab";

const ProjectModal = () => {
  return (
    <>
      <Button
        type="button"
        className="col shadow-none btn p-0 w-100"
        data-bs-toggle="modal"
        data-bs-target="#menuModal"
      >
        <ProjectTab />
      </Button>

      <div
        className="modal fade"
        id="menuModal"
        aria-labelledby="menuModalLabel"
      >
        <div
          className="modal-dialog modal-fullscreen"
          style={{ marginTop: "80px" }}
        >
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
                style={{
                  borderRadius: "20px",
                  background: "#E8E8E8",
                }}
              >
                <div className="col text-end">
                  <Button
                    className="btn p-0 mt-3"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <Image
                      src="/icons/cross.svg"
                      alt="cross"
                      width={20}
                      height={20}
                    />
                  </Button>
                </div>
                <ProjectModalContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;
