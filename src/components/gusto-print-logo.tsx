import { UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export default function GustoPrintLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return <UtensilsCrossed className={cn(className)} {...props} />;
}
