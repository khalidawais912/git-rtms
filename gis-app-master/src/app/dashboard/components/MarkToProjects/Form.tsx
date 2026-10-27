"use client";
import { MARK_TO_EVALUATION_API } from "@/services/endpoints";
import CustomInput from "@/components/Form/CustomInput";
import CustomLabel from "@/components/Form/CustomLabel";
import FormWrapper from "@/components/Form/FormWrapper";
import GenericToggleControl from "@/components/Form/GenericToggleControl";
import SubmitButton from "@/components/Form/SubmitButton";
import apiClient, { AxiosError } from "@/services/client";
import { updatedMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export const schema = z.object({
  id: z.number().int(),
  requestForPCIV: z.boolean().default(true),
  letterofRequestPCIV: z.string().optional(),
  requestForPCIVDate: z.string().datetime().optional(),
  submittedPCIVDate: z.string().datetime().optional(),
});

// Infer the TypeScript type from the schema
export type MarktoEvaluation = z.infer<typeof schema>;

interface Props {
  setRefresh: Dispatch<SetStateAction<boolean>>;
  id: number;
}

const Form = ({ setRefresh, id }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<MarktoEvaluation>({
    resolver: zodResolver(schema),
    defaultValues: {
      id,
    },
  });

  const onSubmit = async (formData: MarktoEvaluation) => {
    console.log("Form Data:", formData);
    console.log(errors);

    try {
      const response = await apiClient({
        method: "PUT",
        url: MARK_TO_EVALUATION_API,
        data: formData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      toast.success(updatedMessage);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <div>
      <FormWrapper heading={"Update Marking"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-2 g-lg-3 mt-0" style={{ marginBottom: "5px" }}>
            <div
              className="col text-start mt-0"
              style={{ marginBottom: "10px", padding: "0px 10px" }}
            >
              <CustomLabel htmlFor="letterofRequestPCIV">
                Letter Of Request PCIV
              </CustomLabel>
              <CustomInput
                {...register("letterofRequestPCIV")}
                id="name"
                type="file"
                placeholder="Upload Letter"
              />
            </div>
            <div
              className="col text-start mt-0"
              style={{ marginBottom: "10px", padding: "0px 10px" }}
            >
              <CustomLabel htmlFor="parentId">Request For PCIV</CustomLabel>
              <GenericToggleControl
                controlType="checkbox"
                checked={false}
                onCheckedChange={async (e) => {
                  console.log(e, "testing");
                }}
              />
            </div>
          </div>

          <SubmitButton>Update</SubmitButton>
        </form>
      </FormWrapper>
    </div>
  );
};

export default Form;
