import { useCharacterStore } from "../../stores/characterStore";

export default function CharacterDock() {
  const name = useCharacterStore((s) => s.current.name);
  const comment = useCharacterStore((s) => s.current.comment);
  const standSrc = useCharacterStore((s) => s.getStandSrc());

  return (
    <div className="sticky top-20 space-y-6">
      <div>
        <div className="text-xs font-semibold text-slate-400">{name}</div>
        <p className="mt-2 text-sm text-slate-800 leading-relaxed">{comment}</p>
      </div>

      <div className="flex justify-center">
        <img src={standSrc} alt={`${name} stand`} className="max-h-[480px] w-full object-contain" />
      </div>
    </div>
  );
}
