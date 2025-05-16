import { Box, Modal } from "@mui/material";
import { X } from "lucide-react";
import { useEventStore, useProductStore } from "../../hooks/useModalState";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "white",
  boxShadow: 24,
  px: 3,
  py: 2,
};

export default function IsAddProduct() {
  const { isAddModal, toggleIsAddModal, text, setIsOnSubmit, type } =
    useEventStore();
  const { onOpen } = useProductStore();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAddModal) {
      onOpen();
    }
    if (type === "create-product") {
      navigate("/maxsulotlar");
      onOpen()
    }
    toggleIsAddModal();
    setIsOnSubmit((prev) => !prev);
    console.log(isAddModal);
    
  };
  return (
    <Modal open={isAddModal} onClose={toggleIsAddModal}>
      <Box sx={style}>
        <div className="flex items-center justify-between pb-8">
          <p className="text-xl uppercase">{text}</p>
          <button
            onClick={toggleIsAddModal}
            className="w-8 h-8 hover:bg-[#f4f1f1] cursor-pointer flex items-center justify-center"
          >
            <X />
          </button>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            onClick={toggleIsAddModal}
            className="text-gray-500 cursor-pointer border border-gray-500 px-5 py-1.5"
          >
            Yo'q
          </button>
          <button
            onClick={handleClick}
            className="text-white cursor-pointer w-[100px] bg-[#249B73] px-5 py-1.5"
          >
            Ha
          </button>
        </div>
      </Box>
    </Modal>
  );
}
