import Title from "../components/Title.tsx";
import ScrollHint from "../components/ScrollHint";
import CollectionGrid from "../components/CollectionGrid";

const Home = () => {
  return (
    <main className="relative w-full overflow-hidden bg-neutral-950 text-neutral-100">
      <section className="relative h-screen w-full flex justify-center">
        <Title
          title="35mm Photography"
          subtitle="Harry Breen"
          description="A collection of 35mm photographs by me"
        />
        <ScrollHint />
      </section>

      <section id="gallery" className="px-4 h-screen md:px-6 lg:px-8 py-8">
        <CollectionGrid />
      </section>
    </main>
  );
};

export default Home;

