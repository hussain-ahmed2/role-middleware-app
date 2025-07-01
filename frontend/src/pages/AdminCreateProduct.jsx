import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { productSchema } from "../validation/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import InputFiled from "../components/form/InputField";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { handleErrors } from "../validation/handleErrors";

function AdminCreateProduct() {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/products", data);

      if (res.data.success) {
        navigate("/admin/products");
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response?.data?.errors)
        handleErrors(error.response.data.errors, methods.setError);
      if (error.response?.data?.message)
        toast.error(error.response.data.message);
    }
  };

  return (
    <div className="page">
      <h2 className="text-4xl font-bold mt-5">Product</h2>

      <div className="my-10">
        <div>
          <p className="text-xl text-center font-bold my-5">Create product</p>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="max-w-3xl mx-auto"
            >
              <InputFiled name="name" label="Name" placeholder="Product name" />
              <InputFiled
                name="price"
                label="Price"
                type="number"
                step="0.01"
                placeholder="Product price"
              />
              <InputFiled
                name="description"
                label="Description"
                placeholder="Product description"
              />

              <div className="flex gap-2 justify-end">
                <button
                  className="btn"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  onClick={() => methods.reset()}
                  type="button"
                >
                  Reset
                </button>
                <button className="btn" type="submit">
                  Create
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
export default AdminCreateProduct;
