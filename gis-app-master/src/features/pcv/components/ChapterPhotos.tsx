"use client";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { PCV_PHOTO_TYPES } from "../constants";
import { deleteChapterPhoto, PcvApiError, pcvFileUrl, uploadChapterPhoto } from "../services";
import { PcvPhoto } from "../types";
import styles from "./Pcv.module.css";

interface Props {
  pcvId: number;
  chapterNo: number;
  photos: PcvPhoto[];
  readOnly: boolean;
  /** Reload the PC-V after a photo was added or removed. */
  onChanged: () => void;
}

/** Photos of chapter 5 or 12 (`allowsPhotos`). Each upload and delete is saved at once. */
const ChapterPhotos = ({ pcvId, chapterNo, photos, readOnly, onChanged }: Props) => {
  const [busy, setBusy] = useState(false);

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    try {
      for (const file of files) await uploadChapterPhoto(pcvId, chapterNo, file);
      toast.success(files.length === 1 ? "Photo added" : `${files.length} photos added`);
    } catch (err) {
      toast.error(err instanceof PcvApiError ? err.message : "The photo could not be uploaded.");
    } finally {
      setBusy(false);
      onChanged();
    }
  };

  const remove = async (photo: PcvPhoto) => {
    if (!window.confirm("Remove this photo?")) return;
    setBusy(true);
    try {
      await deleteChapterPhoto(photo.id);
      toast.success("Photo removed");
      onChanged();
    } catch (err) {
      toast.error(err instanceof PcvApiError ? err.message : "The photo could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  if (readOnly && photos.length === 0) {
    return <p className="text-secondary mt-3 mb-0">No photos.</p>;
  }

  return (
    <div className={styles.photos}>
      {photos.map((photo) => (
        <div key={photo.id} className={styles.photo}>
          <a href={pcvFileUrl(photo.path)} target="_blank" rel="noreferrer">
            <Image unoptimized fill src={pcvFileUrl(photo.path) ?? ""} alt={photo.fileName || `Chapter ${chapterNo} photo`} />
          </a>
          {!readOnly && (
            <button
              type="button"
              className={styles.photoDelete}
              onClick={() => remove(photo)}
              disabled={busy}
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <label className={styles.uploadLabel}>
          <span>
            <ImagePlus size={26} />
            <br />
            {busy ? "Uploading…" : "Add photos"}
          </span>
          <input type="file" accept={PCV_PHOTO_TYPES} multiple onChange={upload} disabled={busy} />
        </label>
      )}
    </div>
  );
};

export default ChapterPhotos;
