import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Admin = (): JSX.Element => {
  const socialIcons = [
    { src: "/figmaAssets/social-icons.svg", alt: "Facebook" },
    { src: "/figmaAssets/social-icons-1.svg", alt: "Twitter" },
    { src: "/figmaAssets/social-icons-3.svg", alt: "Instagram" },
    { src: "/figmaAssets/social-icons-2.svg", alt: "YouTube" },
    { src: "/figmaAssets/social-icons-4.svg", alt: "WhatsApp" },
  ];

  return (
    <div className="bg-white w-full min-w-[1920px] min-h-[1024px] flex relative">
      <div className="flex flex-col w-[904px] relative">
        <img
          className="absolute top-[62px] left-[53px] w-[97px] h-14 object-cover"
          alt="Logo"
          src="/figmaAssets/logo-1.png"
        />

        <div className="flex flex-col w-[464px] items-start gap-[21px] absolute top-[calc(50%_-_146px)] left-[172px]">
          <header className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <h1 className="relative w-fit mt-[-1.00px] font-typography-h6 font-[number:var(--typography-h6-font-weight)] text-textprimary text-[length:var(--typography-h6-font-size)] tracking-[var(--typography-h6-letter-spacing)] leading-[var(--typography-h6-line-height)] whitespace-nowrap [font-style:var(--typography-h6-font-style)]">
              Login
            </h1>
          </header>

          <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
            <Input
              className="flex flex-col items-start px-3 py-0 relative self-stretch w-full flex-[0_0_auto] rounded border border-solid border-[#0000003b] h-auto"
              placeholder="Username *"
            />
          </div>

          <div className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
            <Input
              type="password"
              className="flex flex-col items-start px-3 py-0 relative self-stretch w-full flex-[0_0_auto] rounded border border-solid border-[#0000003b] h-auto"
              placeholder="Password *"
            />
          </div>

          <button className="relative self-stretch [font-family:'Nunito_Sans',Helvetica] font-medium text-textprimary text-sm text-right tracking-[0.10px] leading-[22.0px] bg-transparent border-0 cursor-pointer">
            Forgot your password?
          </button>

          <Button className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto] bg-[#0057ff] rounded overflow-hidden shadow-elevation-2 h-auto hover:bg-[#0057ff]/90">
            <div className="inline-flex flex-col items-start gap-2 px-[22px] py-2 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                <span className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-semibold text-[#ffffffde] text-[15px] tracking-[0.46px] leading-[26px] whitespace-nowrap">
                  LOGIN
                </span>
                <ArrowRightIcon className="relative w-[18px] h-[18px] text-[#ffffffde]" />
              </div>
            </div>
          </Button>
        </div>

        <footer className="absolute top-[887px] left-[172px] w-[464px] flex flex-col items-center gap-[33px]">
          <div className="[font-family:'Nunito_Sans',Helvetica] font-medium text-textprimary text-sm text-center tracking-[0.10px] leading-[22.0px]">
            Follow Us On
          </div>

          <div className="flex items-center gap-12 justify-center">
            {socialIcons.map((icon, index) => (
              <img
                key={index}
                className="w-6 h-6 cursor-pointer"
                alt={icon.alt}
                src={icon.src}
              />
            ))}
          </div>
        </footer>
      </div>

      <div className="flex-1 relative">
        <img
          className="absolute top-0 right-0 w-full h-[1024px] object-cover"
          alt="Promotion bg"
          src="/figmaAssets/promotion-bg.png"
        />

        <div className="absolute top-[692px] left-[56px] w-[936px] [font-family:'Oswald',Helvetica] font-medium text-white text-8xl tracking-[0] leading-[112px]">
          Customized Perfection. Every Stitch, Every Print.
        </div>
      </div>
    </div>
  );
};
