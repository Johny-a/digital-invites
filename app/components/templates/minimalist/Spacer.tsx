"use client";

type Props = {
  h?: number;
};

export default function Spacer({ h = 55 }: Props) {
  return (
    <section
      className="paper-spacer"
      style={{ height: `${h}vh` }}
    />
  );
}