import * as RUISlider from "@radix-ui/react-slider";

import type { ComponentProps } from "react";

const Slider = (props: ComponentProps<typeof RUISlider.Root>) => (
  <RUISlider.Root tw="relative flex items-center w-48 h-5" {...props}>
    <RUISlider.Track tw="bg-gray-200 relative flex-1 rounded-full h-[3px]">
      <RUISlider.Range tw="absolute bg-blue-900/50 rounded-full h-full" />
    </RUISlider.Track>
    <RUISlider.Thumb tw="block w-5 h-5 bg-white border-2 border-blue-600 shadow-sm rounded-full hover:bg-gray-50 focus:(outline-none ring ring-blue-600/20)" />
  </RUISlider.Root>
);

export default Slider;
