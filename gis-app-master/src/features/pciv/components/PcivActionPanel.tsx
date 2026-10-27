"use client";
import { ReportHistoryUser } from "@/features/users";
import AlertMessage from "@/shared/components/AlertMessage";
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader/Loader";
import Spinner from "@/shared/components/Spinner";
import { triggerEscapeKeyPress } from "@/shared/utils";
import "easymde/dist/easymde.min.css";
import type { Options as SimpleMDEOptions } from "easymde";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getPcivButtons,
  getPcivForwardTargets,
  PcivApiError,
  pressPcivButton,
} from "../api";
import {
  PCIV_ACTION,
  PCIV_BUTTON_LABEL,
  PCIV_CONFIRM,
  PCIV_REMARKS_REQUIRED,
} from "../constants";
import {
  PcivButton,
  PcivButtonsResponse,
  PcivPanelLabels,
  PcivPerson,
  PcivReportTrail,
} from "../types";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Props {
  pcivId: number;
  userId: number;
  users: ReportHistoryUser[];
  /** Newest first; used to name the person a refer back goes to. */
  history: PcivReportTrail[];
  /** Called after a button succeeded (reload lists) or when the PC-IV changed under us. */
  onDone: () => void;
  /** Closes the surrounding modal after a button succeeded. */
  onClose?: () => void;
  labels?: PcivPanelLabels;
}

const buttonStyle = (enabled: boolean) => ({
  background: enabled ? "rgba(0, 57, 206,.05)" : "rgba(201, 201, 201,.5)",
  color: enabled ? "#0039CE" : "#454545",
});

/**
 * Workflow buttons for one PC-IV. The server decides which buttons this user has
 * (GET .../buttons); this panel only renders them:
 * - Refer back: a checkbox, the server sends it one level back.
 * - Forward: the next level from GET .../forward-to (a picker when several).
 * - Complete / Cancel: the Assistant Director's final steps, confirmed first.
 */
const PcivActionPanel = ({
  pcivId,
  userId,
  users,
  history,
  onDone,
  onClose,
  labels,
}: Props) => {
  const buttonLabel = (button: PcivButton) =>
    labels?.buttons?.[button] ?? PCIV_BUTTON_LABEL[button];

  const [view, setView] = useState<PcivButtonsResponse>();
  const [targets, setTargets] = useState<PcivPerson[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState<PcivButton | null>(null);

  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [isReferback, setReferback] = useState(false);
  const [toUserId, setToUserId] = useState<number>();

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const buttonsView = await getPcivButtons(pcivId);
      setView(buttonsView);
      const people = buttonsView.buttons.includes("forward")
        ? await getPcivForwardTargets(pcivId)
        : [];
      setTargets(people);
      setToUserId(people.length === 1 ? people[0].userId : undefined);
    } catch (err) {
      setLoadError(
        err instanceof PcivApiError ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, [pcivId]);

  useEffect(() => {
    load();
  }, [load]);

  // The person who last sent it to this user (not by a refer back) gets the refer back.
  const referBackTo = useMemo(() => {
    const sentToMe = history.find(
      (h) => h.mark_to === userId && h.action !== PCIV_ACTION.REFER_BACK,
    );
    return sentToMe
      ? users.find((u) => u.id === sentToMe.mark_From)?.fullName
      : undefined;
  }, [history, userId, users]);

  const mdeOptions = useMemo<SimpleMDEOptions>(
    () => ({
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "code",
      ],
    }),
    [],
  );

  const press = async (button: PcivButton) => {
    if (PCIV_REMARKS_REQUIRED.has(button) && !remarks.trim()) {
      setRemarksError("Remarks are required.");
      return;
    }
    if (button === "forward" && !toUserId) return;
    if (
      PCIV_CONFIRM.has(button) &&
      !window.confirm(`${buttonLabel(button)}? This cannot be undone.`)
    ) {
      return;
    }

    setRemarksError("");
    setBusy(button);
    try {
      const result = await pressPcivButton(pcivId, button, {
        remarks: remarks.trim(),
        toUserId,
      });
      toast.success(`${buttonLabel(button)}: now ${result.statusName}`);
      if (onClose) onClose();
      else triggerEscapeKeyPress();
      onDone();
    } catch (err) {
      toast.error(err instanceof PcivApiError ? err.message : "Something went wrong");
      // 403 / 409: someone else acted or the step changed; show the current buttons
      if (err instanceof PcivApiError && (err.code === 403 || err.code === 409)) {
        await load();
        onDone();
      }
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) return <Loader />;
  if (loadError) {
    return <AlertMessage variant="danger">{loadError}</AlertMessage>;
  }
  if (!view) return null;

  const buttons = view.buttons;
  const has = (b: PcivButton) => buttons.includes(b);
  const isBusy = busy !== null;

  const statusLine = (
    <p className="mb-3">
      <span className="badge bg-secondary me-2">{view.statusName}</span>
      {view.withUser && <span className="text-secondary">With: {view.withUser}</span>}
    </p>
  );

  if (buttons.length === 0) {
    return (
      <>
        {statusLine}
        <p className="mb-0">Response Submitted</p>
      </>
    );
  }

  // Buttons shown next to the remarks: refer back alone when the checkbox is on.
  const actionButtons: PcivButton[] = isReferback
    ? ["referBack"]
    : buttons.filter((b) => b !== "referBack");

  return (
    <>
      {statusLine}
      {view.note && <AlertMessage variant="warning">{view.note}</AlertMessage>}

      <p className="mb-1 fw-normal fs18px">
        Description Level{" "}
        {remarksError && (
          <span className="text-danger mt-1 fs14px">- {remarksError}</span>
        )}
      </p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-2">
          <SimpleMDE
            placeholder="Description"
            className="custom-editor"
            value={remarks}
            onChange={setRemarks}
            options={mdeOptions}
          />
        </div>

        <div className="row mx-0 mb-3">
          {has("referBack") && (
            <div className="col-12 mb-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`referback-${pcivId}`}
                  checked={isReferback}
                  onChange={() => setReferback(!isReferback)}
                />
                <label className="form-check-label" htmlFor={`referback-${pcivId}`}>
                  Referback: {referBackTo ?? "one level back"}
                </label>
              </div>
            </div>
          )}

          {!isReferback && has("forward") && (
            <div className="col-12 mb-2 px-0">
              {targets.length === 0 ? (
                <p className="text-danger mb-0">There is no one to forward to.</p>
              ) : targets.length === 1 ? (
                <p className="mb-0">
                  {`${labels?.forwardTo ?? "Forward To"}: ${targets[0].name} (${targets[0].designation})`}
                </p>
              ) : (
                <select
                  value={toUserId ?? ""}
                  onChange={(e) =>
                    setToUserId(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="form-select fs-6"
                  aria-label="Select the next level"
                >
                  <option value="">Select person to forward to</option>
                  {targets.map((person) => (
                    <option key={person.userId} value={person.userId}>
                      {person.name} ({person.designation})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div className="row d-flex justify-content-end m-0 gap-2">
          {actionButtons.map((button) => {
            const enabled = !isBusy && (button !== "forward" || !!toUserId);
            return (
              <div key={button} className="col-auto">
                <Button
                  type="button"
                  disabled={!enabled}
                  onClick={() => press(button)}
                  className="btn rounded-pill fs18px fw-normal px-3"
                  style={buttonStyle(enabled)}
                >
                  {buttonLabel(button)} {busy === button && <Spinner />}
                </Button>
              </div>
            );
          })}
        </div>
      </form>
    </>
  );
};

export default PcivActionPanel;
