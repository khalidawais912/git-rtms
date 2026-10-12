"use client";
import downloadBlack2 from "@/public/icons/downloadBlack2.svg";
import excel from "@/public/icons/excel.svg";
import pdf from "@/public/icons/pdf.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import styles from "./UserDropDown.module.css";

interface Props {
  onClickPdf?: () => void;
  onClickExcel?: () => void;
  styleVarient?: 1 | 2;
  label?: string;
}

const DownloadDropDown = ({
  onClickPdf,
  onClickExcel,
  styleVarient = 1,
  label = "Download",
}: Props) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevents SSR crash
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <span className={styles.dropdown} ref={dropdownRef}>
      {/* <Button
        className="btn btn-sm rounded-3 shadow-sm"
        onClick={() => setShow(!show)}
        style={{
          background: "rgba(255, 255, 255, 0.62)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        <p className="m-0 text-dark fw-normal">
          Downloads&nbsp;
          <Image src={downloadBlack2} alt="download" width={16} height={16} />
        </p>
      </Button> */}
      {styleVarient === 1 ? (
        <Button
          className="bg-color-evaluation-theme-blue text-white rounded-pill d-flex align-items-center fs15px fw-bold border-0"
          style={{ padding: "8px 13px", gap: "7px" }}
          onClick={() => setShow(!show)}
        >
          <Image
            src="/icons/cloud-download.svg"
            alt="cloud-download"
            width={22}
            height={22}
            style={{ width: "22px", height: "22px" }}
          />
          {label}
        </Button>
      ) : (
        <Button
          className="bg-white rounded-pill d-flex align-items-center fs15px fw-bold"
          style={{
            padding: "8px 13px",
            gap: "7px",
            border: "1px solid #CBD5E1",
            color: "#475569",
          }}
          onClick={() => setShow(!show)}
        >
          <Image
            src="/icons/download-03.svg"
            alt="download-03"
            width={22}
            height={22}
            style={{ width: "22px", height: "22px" }}
          />
          {label}
        </Button>
      )}
      <div
        className={`fs12px ${styles.dropdownContent} ${show && styles.show}`}
      >
        {onClickPdf && (
          <Link
            href="#"
            className="btn w-100 fs12px fw-bold text-start shadow-none"
            onClick={onClickPdf}
          >
            <Image
              src={pdf}
              alt="pdf"
              width={16}
              height={16}
              className="mb-1"
            />
            &nbsp;PDF
          </Link>
        )}
        {onClickExcel && (
          <Link
            href="#"
            className="btn w-100 fs12px fw-bold text-start shadow-none"
            onClick={onClickExcel}
          >
            <Image
              src={excel}
              alt="excel"
              width={16}
              height={16}
              className="mb-1"
            />
            &nbsp;Excel
          </Link>
        )}
      </div>
    </span>
  );
};

export default DownloadDropDown;
