import { useState, useEffect } from "react";
import { useCharacterStore } from "../../stores/characterStore";
import { useTodoStore } from "../../stores/todoStore"; // Todoの変更を検知するために追加

// ランダムなセリフのリスト（自由に追加・変更してください）
const RANDOM_COMMENTS = [
  "えらーい！",
  "その調子！",
  "ちょっと休憩する？",
  "おやつ食べたいな〜",
  "...",
  "水分補給も忘れないでね！",
  "見てるよ〜！",
  "すごい集中力…！",
  "肩の力抜いてこ〜",
  "昨日超かぐや姫のチケ買ってたら午前2時になってた…",
];

export default function CharacterDock() {
  // Storeからデータを取得
  const name = useCharacterStore((s) => s.current.name);
  const storeComment = useCharacterStore((s) => s.current.comment); // 名前をstoreCommentに変更
  const standSrc = useCharacterStore((s) => s.getStandSrc());

  // Todoリストの状態を監視（変更を検知するため）
  const todos = useTodoStore((s) => s.todos);

  // クリックした時の一時的なセリフを管理するState
  const [tempComment, setTempComment] = useState("");

  // 【重要】Todoリストが変わったら、一時的なセリフを消して元のセリフに戻す
  useEffect(() => {
    setTempComment("");
  }, [todos]); // todosが変化するたびに実行される

  // キャラクターをクリックした時の処理
  const handleCharacterClick = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_COMMENTS.length);
    setTempComment(RANDOM_COMMENTS[randomIndex]);
  };

  // 表示するセリフの決定（一時的なセリフがあればそれを、なければStoreのセリフを表示）
  const displayComment = tempComment || storeComment;

  return (
    <div className="sticky top-20 space-y-6">
      <div>
        {/* 名前を吹き出しの外（左上）に配置 */}
        <div className="text-xs font-semibold text-slate-400 ml-1 mb-2">{name}</div>

        {/* 吹き出し本体 */}
        <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* ここを displayComment に変更 */}
          <p className="text-sm text-slate-800 leading-relaxed min-h-[1.5em]">
            {displayComment}
          </p>
          
          {/* しっぽ部分 (下向き) */}
          <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white"></div>
        </div>
      </div>

      <div className="flex justify-center">
        {/* 画像に onClick と カーソルスタイルの追加 */}
        <img 
          src={standSrc} 
          alt={`${name} stand`} 
          onClick={handleCharacterClick}
          className="max-h-[480px] w-full object-contain cursor-pointer transition-transform duration-100 active:scale-95 hover:brightness-105" 
        />
      </div>
    </div>
  );
}