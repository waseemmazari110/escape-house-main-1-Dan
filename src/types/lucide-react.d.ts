declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  export type IconNode = [elementName: string, attrs: Record<string, string>][];
  export type IconProps = SVGProps<SVGSVGElement> & {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  };
  
  export const X: FC<IconProps>;
  export const Loader2: FC<IconProps>;
  export const ArrowLeft: FC<IconProps>;
  export const Eye: FC<IconProps>;
  export const EyeOff: FC<IconProps>;
  export const CheckCircle: FC<IconProps>;
  export const XCircle: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Menu: FC<IconProps>;
  export const ChevronDown: FC<IconProps>;
  export const LogOut: FC<IconProps>;
  export const User: FC<IconProps>;
  export const CreditCard: FC<IconProps>;
  export const Phone: FC<IconProps>;
  export const Home: FC<IconProps>;
  export const Plus: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const BarChart3: FC<IconProps>;
  export const Calendar: FC<IconProps>;
  export const Edit: FC<IconProps>;
  export const Trash2: FC<IconProps>;
}
