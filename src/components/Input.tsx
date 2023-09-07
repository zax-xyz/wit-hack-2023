/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { forwardRef } from "react";
import tw, { styled } from "twin.macro";

import FormErrorMsg from "./FormErrorMsg";

import type {
  ComponentProps,
  ElementType,
  PropsWithChildren,
  ReactNode,
} from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

const InputIcon = tw.div`
  absolute left-1 inset-y-0 p-1.5
  flex items-center justify-center
  text-gray-400 leading-none pointer-events-none
`;
const Input = styled.input({
  ...tw`
    px-3 py-1 w-96 bg-white border border-gray-200 text-gray-900
    transition hover:border-violet-300 focus-within:(border-violet-300 outline-none ring ring-violet-200/50)
  `,
  '&:invalid, &[aria-invalid="true"]': tw`
    border-red-300 text-red-600 ring-red-200/50
    hover:(border-red-400)
  `,

  [`${InputIcon} + &`]: tw`pl-9`,

  variants: {
    size: {
      lg: tw`w-96`,
      sm: tw`w-24 text-sm`,
    },
    nav: {
      true: tw`border-0`,
      false: tw`border-gray-300 rounded shadow-sm`,
    },
  },

  defaultVariants: {
    nav: false,
  },
});

type InputWithIconProps = ComponentProps<typeof Input> & {
  icon: ReactNode;
  iconWidth?: string;
  size?: ComponentProps<typeof Input>["size"];
};
export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  function InputWithIcon({ icon, iconWidth, size, ...props }, ref) {
    return (
      <div tw="flex relative" css={{ ...(size !== undefined && tw`text-sm`) }}>
        <InputIcon
          style={
            iconWidth !== undefined ? { width: iconWidth } : { aspectRatio: 1 }
          }
        >
          {icon}
        </InputIcon>
        <Input
          tw="flex-1"
          style={{ ...(iconWidth !== undefined && { paddingLeft: iconWidth }) }}
          size={size}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

const Label = tw.label`flex flex-col`;

type LabelTextProps = {
  required?: true;
};
const LabelText = ({
  required,
  children,
}: PropsWithChildren<LabelTextProps>) => (
  <span tw="text-gray-700">
    {children}
    {required && <span tw="text-red-600">*</span>}
  </span>
);

export default Object.assign(Input, { Label, LabelText });

type OurRHFInputProps<T extends string> = {
  label: string;
  register: UseFormRegisterReturn<T>;
  errors: { [k in T]?: FieldError };
};
type RHFInputProps<T extends string, A extends ElementType> = Omit<
  ComponentProps<A>,
  keyof OurRHFInputProps<T>
> & { as?: A } & OurRHFInputProps<T>;

export const RHFInput = <
  T extends string,
  A extends ElementType = typeof Input
>({
  label,
  register,
  errors,
  ...props
}: RHFInputProps<T, A>) => (
  <div>
    <Label>
      <LabelText required>{label}</LabelText>
      <Input
        tw="w-full"
        {...register}
        aria-invalid={!!errors[register.name]}
        {...props}
      />
    </Label>
    {errors[register.name] && (
      <FormErrorMsg>{errors[register.name]?.message}</FormErrorMsg>
    )}
  </div>
);
