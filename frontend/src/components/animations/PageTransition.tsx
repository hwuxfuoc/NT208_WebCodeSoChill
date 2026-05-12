/**
 * PageTransition.tsx
 * Slide-up + fade + subtle motion blur on every route change.
 */
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

const variants = {
  hidden:  { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0,  filter: "blur(0px)" },
  exit:    { opacity: 0, y: -6, filter: "blur(4px)" },
};

export default function PageTransition() {
  const { pathname } = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ height: "100%", willChange: "transform, opacity, filter" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
