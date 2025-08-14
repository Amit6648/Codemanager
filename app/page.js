'use client'
import HeroSection from "@/components/HeroSection";
import FeatureShowcase from "@/components/FeatureShowcase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (

    <main className="flex min-h-screen w-full flex-col items-center space-y-32 py-24 px-4 bg-black/50 ">
      <HeroSection />

      {/* This container represents the scroll-telling section */}
      <div className="w-full max-w-5xl space-y-32 ">
        <FeatureShowcase
          title="A Place for Everything."
          description="Build your personal code library with a powerful and familiar tree structure. Organize by project, language, or concept—the way you think."
          visualPlaceholderText="[Scene 1: Camera zooms to the 'root' of the 3D tree]"
        />
        <FeatureShowcase
          title="Find Snippets Instantly."
          description="Powerful, lightning-fast search that understands context. Find exactly what you need, right when you need it, without breaking your flow."
          visualPlaceholderText="[Scene 2: Camera pans to a 'branch' which expands]"
          reverse
        />
        <FeatureShowcase
          title="Code-Aware. Language-Smart."
          description="With beautiful syntax highlighting for dozens of languages, your code will feel right at home. It's not just stored; it's presented."
          visualPlaceholderText="[Scene 3: Camera focuses on a 'leaf' which flips over]"
        />
      </div>

      {/* Final CTA Section */}
      <div className="text-center space-y-4 animate-fade-in-up [animation-delay:300ms]">
        <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Build Better?</h2>
        <p className="text-lg text-athens-gray/80 max-w-xl mx-auto">Start organizing your digital workspace today. Free while in beta.</p>
        <Link href="/login">
          <Button className={"text-lg font-semibold hover:bg-black border hover:border-white hover:text-white"}>
            Join the Beta
          </Button>
        </Link>
      </div>
    </main>
  );
}