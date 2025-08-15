export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-900">
      <div className="text-white pixel-text text-center">
        <h1 className="text-2xl mb-4">Loading...</h1>
        <div className="w-8 h-8 bg-white mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}
