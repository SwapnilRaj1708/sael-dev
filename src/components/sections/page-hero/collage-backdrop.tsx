import type { StaticImageData } from 'next/image';
import { MediaFrame } from '@/components/ui/media-frame';
import { SIZES_COLLAGE } from '@/lib/utils/image-sizes';

export interface CollageImage {
  image: StaticImageData | null;
  /** Meaningful description, or `''` if the photograph is decorative. */
  alt: string;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
}

export interface CollageBackdropProps {
  /** Left to right. Three in the design; the columns follow the count. */
  images: readonly CollageImage[];
}

/**
 * Three photographs side by side behind a `<PageHero>`'s copy, each clipped
 * to the client's `8.svg` panel — Our Core Beliefs' hero (FE-14), built to
 * `Our Core Beliefs.dc.html`.
 *
 * Passed as `<PageHero backdrop>`, which draws it in the photograph's place
 * and leaves the copy, its centring and the band's height exactly as every
 * other inner page has them.
 *
 * **The panel is stretched to each column**, which no other mask on the site
 * is: the design asks for it, and the shape — a rounded panel with one eased
 * corner — survives any ratio. So the columns are simply a third of the hero
 * each, and `--mask-fill` fits the shape to whatever that makes them.
 *
 * Below `lg` the collage takes the top `--collage-h-m` of the hero and the
 * copy stands under it on the black; from `lg` it runs to the hero's foot
 * and the copy sits over its lower third. Either way it starts just under
 * the masthead, and the scrim takes it down to the page's own ground so the
 * hero has no bottom edge.
 *
 * The first photograph carries `priority`: one of the three is the page's
 * largest paint, and one image per page is the rule.
 */
export function CollageBackdrop({ images }: CollageBackdropProps) {
  return (
    <>
      <div className="absolute inset-x-0 top-[calc(var(--spacing-header)+var(--spacing-tight))] grid h-(--collage-h-m) auto-cols-fr grid-flow-col gap-tight lg:top-tight lg:bottom-0 lg:h-auto">
        {images.map((item, index) => (
          <div
            key={index}
            className="relative mask-(--mask-belief-collage) mask-size-(--mask-fill) mask-no-repeat"
          >
            <MediaFrame
              image={item.image}
              alt={item.alt}
              sizes={SIZES_COLLAGE}
              priority={index === 0}
              pending={item.pending}
              className="absolute inset-0"
            />
          </div>
        ))}
      </div>

      {/* Decorative: it carries no information, it protects the copy and
          joins the hero to the ground under it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-(image:--gradient-collage-scrim-m) lg:bg-(image:--gradient-collage-scrim)"
      />
    </>
  );
}
