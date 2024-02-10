import React, { useRef } from "react"
import type { ComponentType, HTMLAttributes } from "react"

interface BackgroundBlur {}

export function OnHover<T extends HTMLAttributes<HTMLElement>>(
    Component: ComponentType<T>
): ComponentType<T & BackgroundBlur> {
    return (props) => {
        const ref = useRef(null)

        return (
            <Component
                {...props}
                style={{
                    position: "relative",
                    background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                }}
            />
        )
    }
}
