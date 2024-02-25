import { Board } from "./components/board";
import { PlaitElement } from "./interfaces";

export default function Home() {
  const value = [
    {
      id: "Xesdcs",
      type: "geometry",
      shape: 'rectangle',
      points: [
        [100, 100],
        [300, 300],
      ],
    },
  ] as PlaitElement[];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Board
        initialValue={value}
        options={{}}
        plaitPlugins={[]}
        plaitViewport={{ zoom: 1 }}
      ></Board>
    </main>
  );
}
