export default function ScoreCard({ data }: any) {
  return (
    <div className="bg-gray-800 p-6 rounded mt-6">
      <h2 className="text-2xl font-bold">Thesis Match</h2>

      <div className="text-4xl font-bold mt-2">
        {data.score}/100
      </div>

      <p className="mt-4 text-gray-300">{data.reasoning}</p>

      <ul className="mt-4 list-disc pl-6">
        {data.matchedSignals?.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
