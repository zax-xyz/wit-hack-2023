import "twin.macro";

import type { ComponentProps } from "react";

const FormErrorMsg = (props: ComponentProps<"span">) => (
  <span tw="text-sm text-red-600" role="alert" {...props} />
);

export default FormErrorMsg;
