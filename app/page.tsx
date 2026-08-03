"use client";

import { useEffect, useRef, useState } from "react";

const prizes = [
  { amount: 1000, tone: "violet" },
  { amount: 2000, tone: "teal" },
  { amount: 1000, tone: "violet" },
  { amount: 3000, tone: "coral" },
  { amount: 1000, tone: "violet" },
  { amount: 2000, tone: "teal" },
  { amount: 1000, tone: "violet" },
  { amount: 5000, tone: "gold" },
] as const;

const formatPrize = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

export default function Home() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<(typeof prizes)[number] | null>(null);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resultTimer.current) clearTimeout(resultTimer.current);
    };
  }, []);

  const spin = () => {
    if (isSpinning) return;

    setWinner(null);
    setIsSpinning(true);

    const random = new Uint32Array(1);
    window.crypto.getRandomValues(random);
    const selectedIndex = random[0] % prizes.length;
    const currentAngle = ((rotation % 360) + 360) % 360;
    const targetAngle = (360 - selectedIndex * 45) % 360;
    const alignment = (targetAngle - currentAngle + 360) % 360;
    const nextRotation = rotation + 6 * 360 + alignment;

    setRotation(nextRotation);
    const spinDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1200 : 5200;
    resultTimer.current = setTimeout(() => {
      setIsSpinning(false);
      setWinner(prizes[selectedIndex]);
    }, spinDuration);
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="game-card" aria-labelledby="page-title">
        <header className="game-header">
          <div className="brand-mark" aria-hidden="true">N</div>
          <div className="brand-copy">
            <span className="brand-name">Naija Rewards</span>
            <span className="brand-status"><i /> Live draw</span>
          </div>
          <div className="secure-pill" aria-label="Fair and secure draw">
            <span aria-hidden="true">◆</span> Secure
          </div>
        </header>

        <div className="hero-copy">
          <p className="eyebrow">TODAY&apos;S LUCKY SPIN</p>
          <h1 id="page-title">Spin &amp; <span>Win</span></h1>
          <p>One tap could land you up to <strong>₦5,000</strong>.</p>
        </div>

        <div className="wheel-stage">
          <div className="pointer" aria-hidden="true">
            <span />
          </div>
          <div className="wheel-rim">
            <div
              className="wheel"
              style={{ transform: `rotate(${rotation}deg)` }}
              role="img"
              aria-label="Prize wheel with eight segments: four 1,000 NGN prizes, two 2,000 NGN prizes, one 3,000 NGN prize and one 5,000 NGN prize"
            >
              {prizes.map((prize, index) => (
                <div
                  className="wheel-label"
                  key={`${prize.amount}-${index}`}
                  style={{
                    "--segment-angle": `${index * 45}deg`,
                    "--counter-angle": `${index * -45}deg`,
                  } as React.CSSProperties}
                >
                  <span>{formatPrize(prize.amount)}</span>
                </div>
              ))}
              <div className="wheel-hub" aria-hidden="true">
                <span className="hub-star">✦</span>
                <b>WIN</b>
              </div>
            </div>
          </div>
        </div>

        <div className="action-area">
          <button className="spin-button" onClick={spin} disabled={isSpinning}>
            <span>{isSpinning ? "Spinning…" : "Spin the wheel"}</span>
            {!isSpinning && <b aria-hidden="true">→</b>}
          </button>
          <p className="helper-text">
            <span aria-hidden="true">✦</span>
            {isSpinning ? "Good luck — your prize is on the way!" : "Tap the button to reveal your reward"}
          </p>
        </div>

        <div className="prize-key" aria-label="Available prizes">
          <span><i className="key-violet" />₦1,000 × 4</span>
          <span><i className="key-teal" />₦2,000 × 2</span>
          <span><i className="key-coral" />₦3,000</span>
          <span><i className="key-gold" />₦5,000</span>
        </div>
      </section>

      {winner && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setWinner(null)}>
          <div
            className={`prize-modal tone-${winner.tone}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="winner-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="confetti" aria-hidden="true">
              {Array.from({ length: 14 }).map((_, index) => <i key={index} />)}
            </div>
            <button className="close-button" onClick={() => setWinner(null)} aria-label="Close prize message">×</button>
            <div className="trophy" aria-hidden="true">★</div>
            <p className="modal-kicker">CONGRATULATIONS!</p>
            <h2 id="winner-title">You won</h2>
            <strong className="prize-amount">{formatPrize(winner.amount)}</strong>
            <p className="modal-copy">Your lucky reward is ready. Enjoy your win!</p>
            <button className="claim-button" onClick={() => setWinner(null)}>Awesome!</button>
            <button className="play-again" onClick={() => { setWinner(null); setTimeout(spin, 120); }}>Spin again</button>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {winner ? `Congratulations! You won ${formatPrize(winner.amount)}.` : isSpinning ? "The wheel is spinning." : ""}
      </p>
    </main>
  );
}
