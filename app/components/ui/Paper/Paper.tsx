"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  bottom?: boolean;
  className?: string;
};

export default function Paper({
  children,
  bottom = true,
  className,
}: Props) {

    return (

        <section
    className={`paper-section ${bottom ? "has-bottom" : ""} ${className ?? ""}`}
>

            <div className="paper-top">
                <img src="/paper/top.svg" alt="" />
            </div>

            <div className="paper-body">

                <div className="paper-inner">

                    {children}

                </div>

            </div>

            {bottom && (

                <div className="paper-bottom">
                    <img src="/paper/bottom.svg" alt="" />
                </div>

            )}

        </section>

    );

}