import "./index.css";

const Badge = () => {
  return (
    <div className="custom-badge">
      <span className="selected-icon">
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-icon="ListCheckBoldOutlined"
        >
          <path
            d="M4 11.293a1 1 0 0 1 1.414 0l4.072 4.07 9.07-9.07a1 1 0 0 1 1.415 0l.706.707a1 1 0 0 1 0 1.414L10.193 18.9a1 1 0 0 1-1.415 0l-5.485-5.485a1 1 0 0 1 0-1.414L4 11.293Z"
            fill="currentColor"
          ></path>
        </svg>
      </span>
    </div>
  );
};

export default Badge;
