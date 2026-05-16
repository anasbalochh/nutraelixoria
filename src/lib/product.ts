import glutageMain from "@/assets/glutage-1.png";
import glutageVials from "@/assets/glutage-2.png";
import glutageHowTo from "@/assets/glutage-3.png";

export const GLUTAGE = {
  id: "glutage-50ml",
  name: "GLUTAGE",
  fullName: "L-Glutathione + Marine Collagen Beauty Shot",
  price: 6000,
  compareAt: 6500,
  size: "50 ml · Daily Shot",
  image: glutageMain,
  images: [glutageMain, glutageVials, glutageHowTo] as const,
};
