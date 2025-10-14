"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function SmoothPageTransition({ children }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 1 }}       // no visible fade start
                animate={{ opacity: 1 }}       // stays fully visible
                exit={{ opacity: 1 }}          // remains fully visible on exit
                transition={{
                    duration: 1.2,               // controls the pacing of route change
                    ease: "easeInOut",
                }}
                style={{
                    height: "100%",
                    width: "100%",
                    transition: "all 1.2s ease-in-out", // smooth layout & color changes
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
