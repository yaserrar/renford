import React, { forwardRef } from "react";

const X = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, style, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      style={style}
      fill="currentColor"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M374.464 0h72.989L287.195 182.473 474.427 430H327.497L212.461 279.58 80.763 430H7.775l169.778 -195.166L-1.746 0h150.579l103.93 137.41zm-25.546 387.158h40.461L127.571 41.254H84.096z" />{" "}
    </svg>
  )
);

X.displayName = "X";

export default X;
