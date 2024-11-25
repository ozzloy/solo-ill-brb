import { useModal } from "../../context/Modal";

const OpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const handleButtonClick = (e) => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick(e);
  };

  return <button onClick={handleButtonClick}>{buttonText}</button>;
};
export default OpenModalButton;
