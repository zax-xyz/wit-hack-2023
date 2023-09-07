import "twin.macro";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "~/components/Button";
import FormErrorMsg from "~/components/FormErrorMsg";
import { RHFInput } from "~/components/Input";
import { pushToast } from "~/utils/toast";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useAtom } from "jotai";
import { loggedInAtom } from "~/atoms/user";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

const LoginTab = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLoggedIn] = useAtom(loggedInAtom);

  const params = useSearchParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const { mutate, error } = api.user.login.useMutation({
    onSuccess: () => {
      setLoggedIn(true);
      void router.push(params.get("next") ?? "/map");
      pushToast("Logged In", "Logged in succesfully", "success");
    },
  });

  return (
    <form
      tw="flex flex-col gap-2"
      onSubmit={(e) =>
        void handleSubmit(({ email, password }) => mutate({ email, password }))(
          e
        )
      }
    >
      <RHFInput
        label="Email"
        register={register("email")}
        errors={errors}
        type="email"
      />
      <RHFInput
        label="Password"
        register={register("password")}
        errors={errors}
        type="password"
      />

      <Button type="submit" tw="mt-2" color="blue">
        Log In
      </Button>

      {error && <FormErrorMsg>{error.message}</FormErrorMsg>}
    </form>
  );
};

export default LoginTab;
