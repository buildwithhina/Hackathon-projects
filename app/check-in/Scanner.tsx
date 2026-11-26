"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import jsQR from "jsqr";
import { scanPass, type ScanResult } from "@/app/check-in/actions";

export function Scanner({ events }: { events: { id: string; title: string }[] }) {
  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const [camera, setCamera] = useState(false);
  const [cameraMessage, setCameraMessage] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ScanResult>();
  const video = useRef<HTMLVideoElement>(null);
  const submitLock = useRef(false);

  async function submit(value: string) {
    if (submitLock.current) return;
    submitLock.current = true;
    setBusy(true);
    setResult(undefined);
    try {
      setResult(await scanPass(eventId, value));
    } catch {
      setResult({ status: "error" });
    } finally {
      submitLock.current = false;
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!camera) return;
    let active = true;
    let stream: MediaStream | undefined;
    let timer: ReturnType<typeof setTimeout>;
    const player = video.current;
    const stop = () => stream?.getTracks().forEach(track => track.stop());

    async function start() {
      if (!navigator.mediaDevices || !player) {
        setCameraMessage("Camera QR scanning is unavailable in this browser. Enter the pass code below.");
        setCamera(false);
        return;
      }
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Camera preview unavailable");
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (!active) return stop();
        player.srcObject = stream;
        await player.play();
        const read = () => {
          if (!active || !player) return;
          try {
            if (!player.videoWidth || !player.videoHeight) {
              timer = setTimeout(read, 200);
              return;
            }
            const scale = Math.min(1, 720 / Math.max(player.videoWidth, player.videoHeight));
            canvas.width = Math.round(player.videoWidth * scale);
            canvas.height = Math.round(player.videoHeight * scale);
            context.drawImage(player, 0, 0, canvas.width, canvas.height);
            const frame = context.getImageData(0, 0, canvas.width, canvas.height);
            const qr = jsQR(frame.data, frame.width, frame.height, { inversionAttempts: "dontInvert" });
            if (!active) return;
            if (qr) {
              setCode(qr.data);
              setCamera(false);
              return;
            }
            timer = setTimeout(read, 200);
          } catch {
            if (active) {
              setCameraMessage("The camera couldn’t read QR codes. Enter the pass code below.");
              setCamera(false);
            }
          }
        };
        read();
      } catch {
        if (active) {
          setCameraMessage("Camera access failed. Check permissions or enter the pass code below.");
          setCamera(false);
        }
      }
    }

    void start();
    return () => { active = false; clearTimeout(timer); stop(); if (player) player.srcObject = null; };
  }, [camera]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCamera(false);
    void submit(code);
  }

  const messages = {
    checked_in: "Check-in confirmed",
    repeat: "Pass already used",
    invalid: "Invalid pass for this event",
    error: "Check-in failed. Try again.",
  };

  if (!events.length) return <p className="eh-panel">There are no published events available for check-in.</p>;

  return (
    <div className="eh-panel eh-form eh-scanner">
      <form onSubmit={handleSubmit}>
        <label>Event<select value={eventId} disabled={busy || camera} onChange={event => { setEventId(event.target.value); setResult(undefined); setCode(""); }}>
          {events.map(event => <option key={event.id} value={event.id}>{event.title}</option>)}
        </select></label>
        <button type="button" className="eh-button secondary" disabled={busy} onClick={() => { setCamera(!camera); setCameraMessage(""); }}>
          {camera ? "Stop camera" : "Scan with camera"}
        </button>
        {camera && <video ref={video} className="eh-video" muted playsInline />}
        {cameraMessage && <p role="status">{cameraMessage}</p>}
        <label>Pass code<input value={code} onChange={event => setCode(event.target.value)} required autoComplete="off" placeholder="eventhub:…" /></label>
        <button className="eh-button" disabled={busy} type="submit">{busy ? "Checking…" : "Validate and check in"}</button>
      </form>
      {result && <div className={`eh-notice ${result.status === "checked_in" ? "success" : ""}`} role="status">
        <strong>{messages[result.status]}</strong>
        {result.attendee && <p>{result.attendee} · {result.team}</p>}
        {result.scanned_at && <time dateTime={result.scanned_at}>{new Date(result.scanned_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</time>}
      </div>}
    </div>
  );
}
