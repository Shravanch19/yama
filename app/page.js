import Core from "@/components/homepage/core";
import Footer from "@/components/homepage/footer";
import Intro from "@/components/homepage/intro"
import Features from "@/components/homepage/features"

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-black px-6 py-12">
          <Intro />
          <Features />
          <Core />
          <Footer />
      </div>
    </>
  );
}
