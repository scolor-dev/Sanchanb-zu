import { useCharacterStore } from "../../stores/characterStore";

export default function CharacterFooter() {
  const name = useCharacterStore((s) => s.current.name);
  const comment = useCharacterStore((s) => s.current.comment);
  const iconSrc = useCharacterStore((s) => s.getIconSrc());

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-20">
      <div className="mx-auto w-full max-w-screen-sm px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-end gap-3">
          
          {/* コメント */}
          <div className="flex-1 rounded-xl bg-white/90 backdrop-blur-sm p-3 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-400">
              {name}
            </div>
            <p className="mt-1 text-sm text-slate-800 leading-relaxed line-clamp-3">
              {comment}
            </p>
          </div>

          {/* キャラクターアイコン */}
          <div className="h-14 w-14 overflow-hidden rounded-full shadow-md">
            <img
              src={iconSrc}
              alt={`${name} icon`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
