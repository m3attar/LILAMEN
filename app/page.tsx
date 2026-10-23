import { Arrow } from "@/components/arrow";
import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-line" /> THE ART OF EVERYDAY SCENT
          </p>
          <h1>
            A Little Cube.
            <br />A Lasting
            <br />
            <em>Impression.</em>
          </h1>
          <p className="hero-description">
            Scented wooden cubes. Five distinct moods.
            <br />A simple little way to make your space feel like you.
          </p>
          <Link href="/shop/" className="button">
            Shop now{" "}
            <span>
              <Arrow />
            </span>
          </Link>
          <div className="hero-bottom">
            <span className="tiny-cube">◇</span>
            <span>Natural form. Personal expression.</span>
          </div>
        </div>
        <div className="hero-art">
          <img
            src={products[1].image}
            alt={products[1].imageAlt}
            width={1254}
            height={1254}
            fetchPriority="high"
          />
          <span className="art-note">A STUDY IN SCENT & SIMPLICITY</span>
          <div className="art-caption">
            <span>THE LILAMEN CUBE</span>
            <span>Small object. Endless possibility.</span>
          </div>
        </div>
      </section>
      <div className="principles">
        <span>WOOD, REIMAGINED</span>
        <i>·</i>
        <span>FIVE SCENT EXPRESSIONS</span>
        <i>·</i>
        <span>A LITTLE EVERYDAY RITUAL</span>
      </div>
      <section className="collection section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR SIGNATURE</p>
            <h2>
              One little cube.
              <br />
              <em>Five ways to feel.</em>
            </h2>
          </div>
          <div>
            <p>
              From bright citrus to deep woods.
              <br />
              Explore a scent that speaks to you.
            </p>
            <Link className="text-link" href="/shop/">
              Discover the collection{" "}
              <span>
                <Arrow />
              </span>
            </Link>
          </div>
        </div>
        <div className="featured-grid">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
        <p className="collection-note">
          The collection is taking shape. All prices are pending configuration.
        </p>
      </section>
      <section className="story-feature">
        <div className="story-art">
          <img
            src={products[4].image}
            alt={products[4].imageAlt}
            width={1254}
            height={1254}
            loading="lazy"
          />
          <span>LESS, WITH MORE FEELING.</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">THE LILAMEN PERSPECTIVE</p>
          <h2>
            Good things
            <br />
            come in
            <br />
            <em>simple forms.</em>
          </h2>
          <p>
            We believe the smallest details can make an everyday space feel more
            personal. LILAMEN brings together a familiar material, a simple
            shape, and the quiet character of scent.
          </p>
          <Link className="text-link" href="/our-story/">
            A little about us{" "}
            <span>
              <Arrow />
            </span>
          </Link>
        </div>
      </section>
      <section className="closing">
        <p className="eyebrow">A SCENT FOR YOUR KIND OF EVERYDAY</p>
        <h2>
          Make a little room
          <br />
          for <em>something personal.</em>
        </h2>
        <Link className="button" href="/shop/">
          Find your scent{" "}
          <span>
            <Arrow />
          </span>
        </Link>
      </section>
    </>
  );
}
