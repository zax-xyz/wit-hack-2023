import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "twin.macro";
import { z } from "zod";

import Button from "~/components/Button";
import FormErrorMsg from "~/components/FormErrorMsg";
import { RHFInput } from "~/components/Input";
// import { pushToast } from 'utils';
import { api } from "~/utils/api";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
    name: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;

const SignupTab = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const { mutate, error } = api.user.register.useMutation({
    onSuccess: () => {
      // setMessage(
      //   "Please wait for an email to be sent for a verification link to activate your account."
      // );
      // pushToast(
      //   'Sign Up',
      //   'Please wait for an email to be sent for a verification link to activate your account.',
      // );
    },
  });

  const onSubmit = (data: Schema) => {
    void mutate({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  };

  return (
    <form
      tw="flex flex-col gap-2"
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
    >
      <RHFInput
        label="Email"
        register={register("email")}
        errors={errors}
        type="email"
      />
      <RHFInput label="Name" register={register("name")} errors={errors} />
      <RHFInput
        label="Password"
        register={register("password")}
        errors={errors}
        type="password"
      />
      <RHFInput
        label="Confirm Password"
        register={register("confirmPassword")}
        errors={errors}
        type="password"
      />

      <Button type="submit" tw="mt-2" color="blue">
        Sign Up
      </Button>

      {error && <FormErrorMsg>{error.message}</FormErrorMsg>}
      {message && <FormErrorMsg>{message}</FormErrorMsg>}
    </form>
  );
};

export default SignupTab;
