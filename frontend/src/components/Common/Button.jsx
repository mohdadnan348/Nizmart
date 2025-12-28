import "./Button.css";

const Button = ({
  text = "Button",
  onClick,
  type = "button",
  variant = "primary", // primary | outline | danger
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`niz-btn niz-btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
