import { Arrow } from "@/components/arrow";
import Link from "next/link";
export default function NotFound() {
  return (
    <section className="closing not-found">
      <p className="eyebrow">404 · A LITTLE LOST</p>
      <h1>
        This scent trail
        <br />
        ends <em>here.</em>
      </h1>
      <p>The page you’re looking for couldn’t be found.</p>
      <Link className="button" href="/shop/">
        Back to the collection <Arrow />
      </Link>
    </section>
  );
}
