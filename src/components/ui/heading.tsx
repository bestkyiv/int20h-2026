import { cn } from "@/util/utils";
import React, { type HTMLAttributes } from "react";

type HeadingProps = {
  children: React.ReactNode;
  level?: 1 | 2; 
} & HTMLAttributes<HTMLHeadingElement>;

const Heading = ({ children, level = 1, className, ...props }: HeadingProps) => {
  const Tag = `h${level}` as 'h1' | 'h2';

  const levelStyles = {
    1: "text-2xl md:text-3xl",
    2: "text-xl md:text-2xl",
  };

  return (
    <Tag
      className={cn(
        "font-pixelated font-black",
        levelStyles[level],
        className
      )}
      {...props} 
    >
      {children}
    </Tag>
  );
};

export default Heading;