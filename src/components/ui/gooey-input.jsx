"use client";;
import { useState, useRef, useEffect, useId, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function GooeyFilter({
  filterId,
  blur
}) {
  return (
    <svg className="absolute hidden h-0 w-0" aria-hidden>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

function SearchIcon({
  layoutId
}) {
  return (
    <motion.svg
      layoutId={layoutId}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="size-4 shrink-0">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.svg>
  );
}

const transition = {
  duration: 0.4,
  type: "spring",
  bounce: 0.25,
};

const iconBubbleVariants = {
  collapsed: { scale: 0, opacity: 0 },
  expanded: { scale: 1, opacity: 1 },
};

export function GooeyInput({
  placeholder = "Search...",
  className,
  classNames,
  collapsedWidth = 100,
  expandedWidth = 220,
  expandedOffset = 40,
  gooeyBlur = 5,
  height = 32,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onOpenChange,
  disabled = false
}) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const filterId = `gooey-filter-${safeId}`;
  const iconLayoutId = `gooey-input-icon-${safeId}`;
  const inputLayoutId = `gooey-input-field-${safeId}`;

  const inputRef = useRef(null);
  const prevExpandedRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = valueProp !== undefined;
  const searchText = isControlled ? valueProp : uncontrolledValue;

  const setSearchText = useCallback((next) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  }, [isControlled, onValueChange]);

  const setExpanded = useCallback((next) => {
    setIsExpanded(next);
    onOpenChange?.(next);
  }, [onOpenChange]);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    } else if (prevExpandedRef.current) {
      setSearchText("");
    }
    prevExpandedRef.current = isExpanded;
  }, [isExpanded, setSearchText]);

  const buttonVariants = useMemo(() => ({
    collapsed: { width: collapsedWidth, marginLeft: 0 },
    expanded: { width: expandedWidth, marginLeft: expandedOffset },
  }), [collapsedWidth, expandedWidth, expandedOffset]);

  const handleExpand = useCallback(() => {
    if (!disabled) setExpanded(true);
  }, [disabled, setExpanded]);

  const handleChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, [setSearchText]);

  const searchTextRef = useRef(searchText);
  searchTextRef.current = searchText;

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (!searchTextRef.current) setExpanded(false);
    }, 150);
  }, [setExpanded]);

  const glassRadius = 'var(--radius-xl)';

  return (
    <div
      className={cn("relative flex items-center justify-center", className, classNames?.root)}>
      <GooeyFilter filterId={filterId} blur={gooeyBlur} />

      {/* Glass visual layer for main button — outside SVG filter */}
      <motion.div
        className="absolute inset-y-0 left-0 pointer-events-none backdrop-blur-xl bg-white/75 dark:bg-white/10 border border-white/70 dark:border-white/25 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
        style={{ borderRadius: glassRadius }}
        variants={buttonVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={transition}
      />

      {/* Glass visual layer for icon bubble — outside SVG filter */}
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none backdrop-blur-xl bg-white/75 dark:bg-white/10 border border-white/70 dark:border-white/25 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
        style={{ width: height, height, borderRadius: glassRadius }}
        variants={iconBubbleVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={transition}
      />

      {/* Gooey filter wrapper — solid bg for merge-shape, content on top */}
      <div
        className={cn("relative z-10 flex items-center justify-center", classNames?.filterWrap)}
        style={{ height, filter: `url(#${filterId})` }}>
        <motion.div
          className={cn("flex items-center justify-center", classNames?.buttonRow)}
          style={{ height }}
          variants={buttonVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}>
          <button
            type="button"
            disabled={disabled}
            onClick={handleExpand}
            style={{ height, borderRadius: glassRadius }}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center gap-2 px-3 text-xs font-medium outline-none bg-background text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
              classNames?.trigger
            )}>
            {!isExpanded ? (
              <SearchIcon layoutId={iconLayoutId} />
            ) : null}
            <motion.input
              layoutId={inputLayoutId}
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              value={searchText}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled || !isExpanded}
              placeholder={placeholder}
              className={cn(
                "h-full min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none",
                isExpanded
                  ? "placeholder:text-muted-foreground"
                  : "pointer-events-none placeholder:text-muted-foreground",
                classNames?.input
              )} />
          </button>
        </motion.div>

        <motion.div
          className={cn(
            "absolute top-1/2 left-0 flex -translate-y-1/2 items-center justify-center",
            classNames?.bubble
          )}
          style={{ width: height, height }}
          variants={iconBubbleVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}>
          <div
            style={{ width: height, height, borderRadius: glassRadius }}
            className={cn(
              "flex items-center justify-center bg-background",
              classNames?.bubbleSurface
            )}>
            <SearchIcon layoutId={iconLayoutId} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
