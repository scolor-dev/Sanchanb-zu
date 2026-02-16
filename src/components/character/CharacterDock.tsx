// src/components/character/CharacterDock.jsx
import { useCharacterStore } from "../../stores/characterStore";

export default function CharacterDock() {
  const name = useCharacterStore((s) => s.current.name);
  const comment = useCharacterStore((s) => s.current.comment);
  const standSrc = useCharacterStore((s) => s.getStandSrc());

  return (
    <div className="sticky top-20 space-y-6">
      <div>
        {/* 名前を吹き出しの外（左上）に配置 */}
        <div className="text-xs font-semibold text-slate-400 ml-1 mb-2">{name}</div>

        {/*  吹き出し本体 */}
        <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-800 leading-relaxed">{comment}</p>
          
          {/* しっぽ部分 (下向き) */}
          {/* absoluteで配置し、45度回転させてV字を作る */}
          <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white"></div>
        </div>
      </div>

      <div className="flex justify-center">
        <img src={standSrc} alt={`${name} stand`} className="max-h-[480px] w-full object-contain" />
      </div>
    </div>
  );
}