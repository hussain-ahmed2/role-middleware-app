import { useState } from "react";
import Modal from "./Modal";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import { toast } from "react-toastify";

function DeleteProductBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  function handleClose() {
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        navigate("/admin/products");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button onClick={handleOpen} type="button" className="btn-danger">
        Delete
      </button>

      <Modal isOpen={isOpen}>
        <div>Are you sure you want to delete this product</div>
        <div className="flex gap-5 mt-3 justify-end">
          <button type="button" className="btn" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="btn-submit" onClick={handleDelete}>
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
}
export default DeleteProductBtn;
