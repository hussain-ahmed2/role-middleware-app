import { useForm, FormProvider } from "react-hook-form";
import InputFiled from "./form/InputField";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../validation/zod-schemas";
import { api } from "../api/axios";
import { toast } from "react-toastify";

function ProductFrom({ product: { _id: id, name, description, price } }) {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: { name, price, description },
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data) => {
    const res = await api.put(`/products/${id}`, data);
    if (res.data.success) {
      navigate("/admin/products");
      toast.success(res.data.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto"
      >
        <InputFiled name="name" label="Name" />
        <InputFiled name="price" label="Price" type="number" step="0.01" />
        <InputFiled name="description" label="Description" />

        <div className="flex gap-2 justify-end">
          <button className="btn" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => methods.reset({ name, price, description })}
            type="button"
          >
            Reset
          </button>
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
export default ProductFrom;
