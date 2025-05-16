import { getLatestArticlesServer } from "./firebase/articles.server";
import { HeroSection, ContentSection, FeaturedArticles } from "./components/HomeSections";

export default async function Home() {
  const featuredArticles = await getLatestArticlesServer(2);

  return (
    <>
      <HeroSection />
      <ContentSection />
      <FeaturedArticles articles={featuredArticles} />
    </>
  );
}
