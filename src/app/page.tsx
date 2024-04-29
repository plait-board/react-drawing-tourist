"use client";
import { Board } from "./components/board";
import { PlaitElement } from "./interfaces";

export default function Home() {
  const value = [
    {
      id: "Xesdcs",
      type: "geometry",
      shape: "rectangle",
      text: {
        children: [
          {
            text: "开始",
          },
        ],
        align: "center",
      },
      points: [
        [100, 100],
        [300, 300],
      ],
      strikeWidth: 2,
      textHeight: 20
    },
  ] as PlaitElement[];

  return (
    <main className="min-h-screen">
      <Board
        initialValue={value}
        options={{}}
        plaitPlugins={[]}
        onChange={(e) => {
          console.log("board change", e);
        }}
        plaitViewport={{ zoom: 1 }}
        initializeCompleted={(board) => {
          console.log(board);
        }}
      ></Board>
    </main>
  );
}
