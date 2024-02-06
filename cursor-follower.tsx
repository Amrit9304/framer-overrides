import type { ComponentType } from "react"
import { useRef, useState, useEffect } from "react"
import { motion, useSpring } from "framer-motion"

function hasButtonOrAnchorAncestor(element: HTMLElement | null): boolean {
    if (!element) {
        return false
    }

    if (element.tagName === "BUTTON" || element.tagName === "A") {
        return true
    }

    return hasButtonOrAnchorAncestor(element.parentElement)
}

export function withCursorFollow(Component: ComponentType): ComponentType {
    return (props: any) => {
        if (typeof document === "undefined") {
            return null as any
        }

        const cursorStyle = document.createElement("style")
        cursorStyle.appendChild(
            document.createTextNode(
                `.custom-cursor { cursor: none !important; transition: transform 0.3s ease-in-out; }`
            )
        )
        document.head.appendChild(cursorStyle)

        const cursorRef = useRef(null)
        const [isHovering, setIsHovering] = useState(false)
        const [isClicked, setIsClicked] = useState(false)

        const spring = {
            type: "spring",
            stiffness: 1000,
            damping: 70,
        }

        const storedPosition = localStorage.getItem("cursorPosition")
        const initialCursorPosition = useRef(
            storedPosition
                ? JSON.parse(storedPosition)
                : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        )

        const positionX = useSpring(initialCursorPosition.current.x, spring)
        const positionY = useSpring(initialCursorPosition.current.y, spring)

        useEffect(() => {
            const handleMouseMove = (e: MouseEvent) => {
                if (!cursorRef.current) return

                const isHovered =
                    e.target instanceof HTMLElement &&
                    (e.target.tagName === "BUTTON" ||
                        e.target.tagName === "A" ||
                        hasButtonOrAnchorAncestor(e.target.parentElement))
                setIsHovering(isHovered)

                positionX.set(e.clientX)
                positionY.set(e.clientY)

                localStorage.setItem(
                    "cursorPosition",
                    JSON.stringify({ x: e.clientX, y: e.clientY })
                )
            }

            const handleClick = () => {
                setIsClicked(true)

                setTimeout(() => {
                    setIsClicked(false)
                }, 100)
            }

            initialCursorPosition.current.x = window.innerWidth / 2
            initialCursorPosition.current.y = window.innerHeight / 2

            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("click", handleClick)

            return () => {
                window.removeEventListener("mousemove", handleMouseMove)
                window.removeEventListener("click", handleClick)
            }
        }, [])

        return (
            <motion.div
                ref={cursorRef}
                style={{
                    position: "fixed",
                    left: positionX,
                    top: positionY,
                    pointerEvents: "none",
                    zIndex: 9999,
                    transform: `translate(-50%, -50%) scale(${
                        isClicked ? 0.6 : 1
                    })`,
                    transition: `transform 0.1s ease-out`,
                }}
                className={isHovering ? "custom-cursor hover" : "custom-cursor"}
            >
                <Component {...props} />
            </motion.div>
        )
    }
}
