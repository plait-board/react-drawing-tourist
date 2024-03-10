'use client';
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
    <main className="min-h-screen">
      <Board
        initialValue={value}
        options={{}}
        plaitPlugins={[]}
        plaitViewport={{ zoom: 1 }}
      ></Board>
    </main>
  );
}
