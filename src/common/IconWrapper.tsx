'use client'

import { IconContext } from "react-icons";

export function IconWrapper({ children }: React.PropsWithChildren) {
    return (
        <IconContext.Provider
          value={{
            color: "var(--text-color)",
            style: { verticalAlign: "top" },
          }}
        >
          {children}
        </IconContext.Provider>
    );
  }