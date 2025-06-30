import classNames from "classnames";
import React from "react";

function LowCodeFormIcon(props: { classNames?: string }) {
  return (
    <div
      className={classNames(
        "h-9 w-9 bg-[#7f70f5] rounded-lg flex items-center justify-center",
        props.classNames
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    </div>
  );
}

export default function Header(props: {
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  title?: string;
}) {
  const { rightContent, leftContent, title } = props;
  return (
    <header className="bg-white border-b border-solid border-gray-200 py-4 px-6 flex items-center justify-between shadow-md z-30">
      <div className="flex items-center gap-4">
        <div>
          <LowCodeFormIcon />
        </div>
        {leftContent || (
          <h1 className="text-xl font-semibold text-walkflow-darktext">
            {title || "Formex Designer"}
          </h1>
        )}
      </div>
      <div>{rightContent}</div>
    </header>
  );
}
