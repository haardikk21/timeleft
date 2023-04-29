import { NextResponse } from "next/server";
import clsx from "clsx";
import satori from "satori";

export async function GET(request: Request) {
  const galanoGrotesque = await fetch(
    "https://learnweb3.io/fonts/Galano-Grotesque-Bold.otf"
  );
  const galanoGrotesqueBuffer = await galanoGrotesque.arrayBuffer();

  const { searchParams } = new URL(request.url);
  const birthday = searchParams.get("birthday");
  if (!birthday)
    return NextResponse.json(
      { error: "Missing `birthday` parameter" },
      { status: 400 }
    );

  const birthDate = new Date(birthday);
  const weeksSinceBirthday = Math.floor(
    (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );

  const weeksUntil90Years = 90 * 52 - weeksSinceBirthday;

  const FIFTY_TWO = Array.from({ length: 52 }, (_, i) => i + 1);
  const NINETY = Array.from({ length: 90 }, (_, i) => i + 1);

  const svg = await satori(
    <main tw="relative">
      <div tw="flex flex-col justify-between h-[720px]">
        {NINETY.map((n) => (
          <div key={`ninety-${n}`} tw="w-[1280px] flex justify-between">
            {FIFTY_TWO.map((i) => (
              <div
                key={`fifty-two-${i}`}
                tw={clsx(
                  "text-black w-[6px] h-[6px] border border-gray-700",
                  n * 52 + i <= weeksSinceBirthday ? "bg-black" : "bg-white"
                )}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div tw="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center">
        <h1 tw="text-4xl font-bold text-indigo-600">
          You have {weeksUntil90Years.toLocaleString()} weeks left to do cool
          shit.
        </h1>
      </div>
    </main>,
    {
      width: 1280,
      height: 720,
      fonts: [
        {
          name: "Galano Grotesque",
          data: galanoGrotesqueBuffer,
        },
      ],
    }
  );

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
