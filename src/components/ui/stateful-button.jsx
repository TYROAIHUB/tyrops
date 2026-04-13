"use client"
import { cn } from "@/lib/utils"
import React from "react"
import { motion, useAnimate } from "motion/react"

export const StatefulButton = ({
  className,
  children,
  variant = "primary",
  type,
  form,
  disabled,
  ...props
}) => {
  const [scope, animate] = useAnimate()

  const animateLoading = async () => {
    await animate(".loader", { width: "20px", scale: 1, display: "block" }, { duration: 0.2 })
  }

  const animateSuccess = async () => {
    await animate(".loader", { width: "0px", scale: 0, display: "none" }, { duration: 0.2 })
    await animate(".check", { width: "20px", scale: 1, display: "block" }, { duration: 0.2 })
    await animate(".check", { width: "0px", scale: 0, display: "none" }, { delay: 1.5, duration: 0.2 })
  }

  const handleClick = async (event) => {
    if (type === "submit") return // form submit handles itself
    await animateLoading()
    await props.onClick?.(event)
    await animateSuccess()
  }

  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...buttonProps
  } = props

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 ring-primary",
    destructive:
      "bg-destructive text-white hover:bg-destructive/90 ring-destructive",
    outline:
      "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground ring-ring",
  }

  return (
    <motion.button
      layout
      ref={scope}
      type={type}
      form={form}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium ring-offset-2 transition duration-200 hover:ring-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.primary,
        className
      )}
      {...buttonProps}
      onClick={type === "submit" ? onClick : handleClick}
    >
      <motion.div layout className="flex items-center gap-1.5">
        <Loader />
        <CheckIcon />
        <motion.span layout className="flex items-center gap-1.5">{children}</motion.span>
      </motion.div>
    </motion.button>
  )
}

const Loader = () => (
  <motion.svg
    animate={{ rotate: [0, 360] }}
    initial={{ scale: 0, width: 0, display: "none" }}
    style={{ scale: 0.5, display: "none" }}
    transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="loader"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3a9 9 0 1 0 9 9" />
  </motion.svg>
)

const CheckIcon = () => (
  <motion.svg
    initial={{ scale: 0, width: 0, display: "none" }}
    style={{ scale: 0.5, display: "none" }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
  </motion.svg>
)
