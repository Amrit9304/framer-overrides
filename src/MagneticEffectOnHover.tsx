import React, { useRef, useState } from "react"
import type { ComponentType } from "react"
import { motion } from "framer-motion"

interface OnHoverProps {}

export function OnHover(Component: ComponentType): ComponentType<OnHoverProps> {
    return (props) => {
        const ref = useRef(null)
        const [position, setPosition] = useState({ x: 0, y: 0 })
        const [isHovering, setIsHovering] = useState(false)

        const handleMouseMove = (event) => {
            setIsHovering(true)
            const { clientX, clientY } = event
            const { left, top, width, height } =
                event.target.getBoundingClientRect()

            const stickiness = 0.3

            const centerX = left + width / 2
            const centerY = top + height / 2
            const distanceX = clientX - centerX
            const distanceY = clientY - centerY

            // Apply stickiness using a logarithmic function
            const stickyX =
                distanceX * Math.log(Math.abs(distanceX) + 1) * stickiness
            const stickyY =
                distanceY * Math.log(Math.abs(distanceY) + 1) * stickiness

            setPosition({ x: stickyX, y: stickyY })
        }

        const reset = () => {
            setIsHovering(false)
            setPosition({ x: 0, y: 0 })
        }

        const { x, y } = position

        return (
            <motion.div
                style={{ position: "relative" }}
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={reset}
                animate={{ x, y }}
                transition={
                    isHovering
                        ? {
                              type: "spring",
                              stiffness: 150,
                              damping: 15,
                              mass: 0.1,
                          }
                        : {
                              type: "spring",
                              stiffness: 300,
                              damping: 18,
                              mass: 1.1,
                          }
                }
            >
                <Component {...props} />
            </motion.div>
        )
    }
}
