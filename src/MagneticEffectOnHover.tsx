import React, { useRef, useState } from "react"
import type { ComponentType } from "react"
import { motion } from "framer-motion"

interface EnlargeOnHoverProps {}

export function withEnlargeOnHover(
    Component: ComponentType
): ComponentType<EnlargeOnHoverProps> {
    return (props) => {
        const ref = useRef(null)
        const [position, setPosition] = useState({ x: 0, y: 0 })

        const handleMouseMove = (event) => {
            const { clientX, clientY } = event
            const { left, top, width, height } =
                event.target.getBoundingClientRect()

            const value = 0.4 //change it according to how much movement you want, 1 is default
            const middleX = (clientX - (left + width / 2)) * value
            const middleY = (clientY - (top + height / 2)) * value
            setPosition({ x: middleX, y: middleY })
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
