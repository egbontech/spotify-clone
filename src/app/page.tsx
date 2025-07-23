import AllSongs from "@/components/AllSongs";
import FrontendLayout from "@/layouts/FrontendLayout";


export default function Home() {
  return (
    <FrontendLayout>
      <div className="min-h-screen bg-background my-15 lg:ml-80 lg:mx-4 p-4 font-semibold">
        <h2 className="text-2xl text-white mb-3">New Songs</h2>
        <AllSongs/>    
      </div>
    </FrontendLayout>
  );
}
