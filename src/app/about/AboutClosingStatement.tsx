/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/about/AboutClosingStatement.tsx
 *
 * Purpose :
 * Renders an isolated premium three-dimensional closing
 * statement without affecting other About page sections.
 *
 * Version : v1.0.0
 * ============================================================
 */

import type { CSSProperties } from "react";

type AboutClosingStatementProps = {
  text: string;
  backgroundColor: string;
  textColor: string;
  contentMaxWidth: number;
  paddingTop: number;
  paddingBottom: number;
};

type ClosingStyle =
  CSSProperties &
  Record<`--${string}`, string | number>;

export default function AboutClosingStatement({
  text,
  backgroundColor,
  textColor,
  contentMaxWidth,
  paddingTop,
  paddingBottom,
}: AboutClosingStatementProps) {
  const style: ClosingStyle = {
    "--closing-background": backgroundColor,
    "--closing-text": textColor,
    "--closing-width": `${contentMaxWidth}px`,
    "--closing-padding-top": `${paddingTop}px`,
    "--closing-padding-bottom": `${paddingBottom}px`,
  };

  return (
    <section
      id="closing-statement"
      className="aboutClosing3D"
      style={style}
      aria-label="Warm Life closing statement"
    >
      <div className="aboutClosing3D__stage">
        <article
          className="aboutClosing3D__panel"
          tabIndex={0}
        >
          <span
            className="aboutClosing3D__accent"
            aria-hidden={true}
          />

          <span
            className="aboutClosing3D__glow"
            aria-hidden={true}
          />

          <p>{text}</p>
        </article>
      </div>
    </section>
  );
}
