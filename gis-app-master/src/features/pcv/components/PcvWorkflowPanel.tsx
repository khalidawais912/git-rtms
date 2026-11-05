"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PCV_BUTTON_LABEL,
  PCV_CONFIRM,
  PCV_NEEDS_PERSON,
  PCV_REMARKS_REQUIRED,
  PCV_STATUS_CLASS,
} from "../constants";
import { getPcvForwardTargets, PcvApiError, pressPcvButton } from "../services";
import { PcvButton, PcvButtonsResponse, PcvPerson } from "../types";
import styles from "./Pcv.module.css";

interface Props {
  pcvId: number;
  /** GET .../buttons, loaded by the page so the form knows `canEdit` too. */
  view: PcvButtonsResponse;
  /** Unsaved edits on the form: submitting would send the old text. */
  hasUnsavedChanges: boolean;
  /** Reload the PC-V and its buttons (after an action, or when the step changed under us). */
  onDone: () => void;
  onSessionExpired: () => void;
}

/**
 * Workflow buttons for one PC-V. The server decides which buttons this user has;
 * this panel only renders them, as on PC-IV:
 * Department `submit` → Secretary `forward` / `referBack` → DG `forward` / `referBack`
 * → Director → Deputy Director → Assistant Director `complete` / `cancel` / `referBack`.
 * Submit and forward go to a person from GET .../forward-to; refer back and cancel need remarks.
 */
const PcvWorkflowPanel = ({ pcvId, view, hasUnsavedChanges, onDone, onSessionExpired }: Props) => {
  const needsPerson = view.buttons.some((b) => PCV_NEEDS_PERSON.has(b));
  const [targets, setTargets] = useState<PcvPerson[]>();
  const [targetsError, setTargetsError] = useState("");
  const [toUserId, setToUserId] = useState<number>();
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [isReferBack, setReferBack] = useState(false);
  const [busy, setBusy] = useState<PcvButton | null>(null);

  useEffect(() => {
    if (!needsPerson) return;
    let cancelled = false;
    setTargets(undefined);
    setTargetsError("");
    getPcvForwardTargets(pcvId)
      .then((people) => {
        if (cancelled) return;
        setTargets(people);
        setToUserId(people.length === 1 ? people[0].userId : undefined);
      })
      .catch((err) => {
        if (cancelled) return;
        setTargets([]);
        setTargetsError(err instanceof PcvApiError ? err.message : "Could not load the next level.");
      });
    return () => {
      cancelled = true;
    };
  }, [pcvId, needsPerson]);

  const press = async (button: PcvButton) => {
    if (PCV_REMARKS_REQUIRED.has(button) && !remarks.trim()) {
      setRemarksError("Remarks are required.");
      return;
    }
    if (PCV_NEEDS_PERSON.has(button) && !toUserId) return;
    if (button === "submit" && hasUnsavedChanges) {
      toast.error("Save your changes before you submit.");
      return;
    }
    if (PCV_CONFIRM.has(button) && !window.confirm(`${PCV_BUTTON_LABEL[button]}? This cannot be undone.`)) {
      return;
    }
    setRemarksError("");
    setBusy(button);
    try {
      const result = await pressPcvButton(pcvId, button, { remarks: remarks.trim(), toUserId });
      toast.success(`${PCV_BUTTON_LABEL[button]}: now ${result.statusName}`);
      setRemarks("");
      setReferBack(false);
      onDone();
    } catch (err) {
      if (err instanceof PcvApiError && err.code === 401) {
        onSessionExpired();
        return;
      }
      toast.error(err instanceof PcvApiError ? err.message : "Something went wrong.");
      // 403 / 409: someone else acted or the step changed; show the current state
      if (err instanceof PcvApiError && (err.code === 403 || err.code === 409)) onDone();
    } finally {
      setBusy(null);
    }
  };

  const statusLine = (
    <div className={styles.statusLine}>
      <span className={`badge ${PCV_STATUS_CLASS[view.status] ?? "bg-secondary"}`}>{view.statusName}</span>
      {view.withUser && <span>With: {view.withUser}</span>}
    </div>
  );

  if (view.buttons.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Workflow</h2>
        <div className="mt-3">{statusLine}</div>
        {view.note && <p className={styles.notice}>{view.note}</p>}
        <p className="mb-0 text-secondary">There is nothing for you to do on this PC-V now.</p>
      </section>
    );
  }

  const has = (b: PcvButton) => view.buttons.includes(b);
  // Refer back is a checkbox, as on PC-IV: when on, it is the only button.
  const shown: PcvButton[] = isReferBack ? ["referBack"] : view.buttons.filter((b) => b !== "referBack");
  const personButton = shown.some((b) => PCV_NEEDS_PERSON.has(b));

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Workflow</h2>
      <div className="mt-3">{statusLine}</div>
      {view.note && <p className={styles.notice}>{view.note}</p>}

      <label className={styles.fieldLabel} htmlFor={`pcv-remarks-${pcvId}`}>
        Remarks {(isReferBack || has("cancel")) && <span className="text-secondary fw-normal">(required to refer back or cancel)</span>}
      </label>
      <textarea
        id={`pcv-remarks-${pcvId}`}
        className={styles.textarea}
        value={remarks}
        onChange={(e) => {
          setRemarks(e.target.value);
          setRemarksError("");
        }}
        placeholder="Remarks"
      />
      {remarksError && <p className={styles.error}>{remarksError}</p>}

      {has("referBack") && (
        <label className={styles.checkRow}>
          <input type="checkbox" checked={isReferBack} onChange={() => setReferBack(!isReferBack)} />
          Refer back one level
        </label>
      )}

      {personButton && (
        <div className="mt-2">
          {!targets ? (
            <p className="text-secondary mb-0">Loading the next level…</p>
          ) : targetsError ? (
            <p className={styles.error}>{targetsError}</p>
          ) : targets.length === 0 ? (
            <p className={styles.error}>There is no one to send it to.</p>
          ) : targets.length === 1 ? (
            <p className="mb-0">
              Send to: <strong>{targets[0].name}</strong> ({targets[0].designation})
            </p>
          ) : (
            <select
              className={styles.select}
              value={toUserId ?? ""}
              onChange={(e) => setToUserId(e.target.value ? Number(e.target.value) : undefined)}
              aria-label="Send to"
            >
              <option value="">Select the person to send it to</option>
              {targets.map((p) => (
                <option key={p.userId} value={p.userId}>
                  {p.name} ({p.designation})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className={styles.actions}>
        {shown.map((button) => {
          const disabled = busy !== null || (PCV_NEEDS_PERSON.has(button) && !toUserId);
          const danger = button === "cancel" || button === "referBack";
          return (
            <button
              key={button}
              type="button"
              disabled={disabled}
              onClick={() => press(button)}
              className={danger ? styles.dangerButton : styles.primaryButton}
            >
              {busy === button ? "Please wait…" : PCV_BUTTON_LABEL[button]}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PcvWorkflowPanel;
