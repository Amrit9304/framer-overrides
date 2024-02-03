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
                `.custom-cursor { cursor: none !important; }`
            )
        )
        document.head.appendChild(cursorStyle)

        const cursorRef = useRef(null)
        const [isHovering, setIsHovering] = useState(false)

        const spring = {
            type: "spring",
            stiffness: 1000,
            damping: 70,
        }

        const clickSpring = {
            type: "spring",
            stiffness: 500,
            damping: 30,
        }

        const [isClicked, setIsClicked] = useState(false)

        const handleClick = () => {
            setIsClicked(true)

            setTimeout(() => {
                setIsClicked(false)
            }, 100)
        }

        const storedPosition = localStorage.getItem("cursorPosition")
        const initialCursorPosition = useRef(
            storedPosition
                ? JSON.parse(storedPosition)
                : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        )

        const positionX = useSpring(
            initialCursorPosition.current.x,
            isClicked ? clickSpring : spring
        )
        const positionY = useSpring(
            initialCursorPosition.current.y,
            isClicked ? clickSpring : spring
        )

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

            initialCursorPosition.current.x = window.innerWidth / 2
            initialCursorPosition.current.y = window.innerHeight / 2

            window.addEventListener("mousemove", handleMouseMove)
            return () => {
                window.removeEventListener("mousemove", handleMouseMove)
            }
        }, [isClicked])

        useEffect(() => {
            const handleMouseClick = () => {
                handleClick()
            }

            window.addEventListener("click", handleMouseClick)

            return () => {
                window.removeEventListener("click", handleMouseClick)
            }
        }, [])

        return (
            <motion.div
                ref={cursorRef}
                className={`custom-cursor ${isHovering ? "hovered" : ""}`}
                style={{
                    position: "fixed",
                    left: positionX,
                    top: positionY,
                    pointerEvents: "none",
                    zIndex: 9999,
                    transform: `translate(-50%, -50%) scale(${
                        isClicked ? 1.5 : 1
                    })`, // Adjusted transform to include translation
                    transition: `transform 0.1s ease-out`,
                }}
            >
                <Component {...props} />
            </motion.div>
        )
    }
}
