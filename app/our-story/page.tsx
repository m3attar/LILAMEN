import { Arrow } from "@/components/arrow";
import Link from "next/link";
export const metadata = { title: "Our story" };
export default function Story() {
  return (
    <>
      <section className="page-intro section">
        <p className="eyebrow">OUR STORY</p>
        <h1>
          A small form.
          <br />A <em>personal feeling.</em>
        </h1>
        <p>
          LILAMEN starts with a simple idea: everyday objects can invite a
          little more intention into our spaces.
        </p>
      </section>
      <section className="story-feature">
        <div className="story-art">
          <img
            src="/visuals/story.svg"
            alt="Original illustration exploring wooden cube forms"
          />
        </div>
        <div className="story-copy">
          <p className="eyebrow">SCENT, SIMPLY.</p>
          <h2>
            Nothing extra.
            <br />
            <em>Just character.</em>
          </h2>
          <p>
            Wood. A cube. A scent. Our collection brings these elements together
            in an object with a clear, considered form.
          </p>
          <p>
            Berry, Oud, Blue Magic, Lemon, and Papaya offer five starting points
            for discovering what feels like you. This is an introduction to the
            collection as it takes shape.
          </p>
          <Link href="/shop/" className="text-link">
            Meet the five scents <Arrow />
          </Link>
        </div>
      </section>
      <section className="closing">
        <h2>
          It’s the little things
          <br />
          that <em>feel like home.</em>
        </h2>
        <p>Explore the preview. Imagine your everyday.</p>
        <Link className="button" href="/shop/">
          Explore LILAMEN <Arrow />
        </Link>
      </section>
    </>
  );
}
