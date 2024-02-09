import React, { useRef, useState } from "react"
import type { ComponentType } from "react"
import { motion } from "framer-motion"

interface OnHoverProps {}

export function OnHover(Component: ComponentType): ComponentType<OnHoverProps> {
    return (props) => {
        const ref = useRef(null)
        const [position, setPosition] = useState({ x: 0, y: 0 })

        const handleMouseMove = (event) => {
            const { clientX, clientY } = event
            const { left, top, width, height } =
                event.target.getBoundingClientRect()

            // Adjust the stickiness factor
            const stickiness = 0.3
            
            const centerX = left + width / 2
            const centerY = top + height / 2
            const distanceX = clientX - centerX
            const distanceY = clientY - centerY

            const stickyX =
                distanceX * Math.log(Math.abs(distanceX) + 1) * stickiness
            const stickyY =
                distanceY * Math.log(Math.abs(distanceY) + 1) * stickiness

            setPosition({ x: stickyX, y: stickyY })
        }

        const reset = () => {
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
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
            >
                <Component {...props} />
            </motion.div>
        )
    }
}
