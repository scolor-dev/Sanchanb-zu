import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTodoStore } from '../stores/todoStore'; 

export default function About() {
  // 1. ストアから全Todoを取得
  const todos = useTodoStore((state) => state.todos);

  // 2. 「直近1週間」のデータを計算するロジック
  const calculateWeeklyStats = () => {
    const today = new Date();
    // 日付の時刻部分をリセット（比較を正確にするため）
    today.setHours(23, 59, 59, 999);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    // 日付でフィルタリング（直近1週間以内のもの）
    const weeklyTodos = todos.filter((todo) => {
      const todoDate = new Date(todo.date);
      return todoDate >= oneWeekAgo && todoDate <= today;
    });

    const total = weeklyTodos.length;
    // isCompleted が true のものを数える
    const completedCount = weeklyTodos.filter((t) => t.isCompleted).length;

    return {
      total,
      completed: completedCount,
      remaining: total - completedCount
    };
  };

  const { total, completed, remaining } = calculateWeeklyStats();

  // グラフ用データ作成
  const data = [
    { name: '達成', value: completed },
    { name: '未達成', value: remaining },
  ];

  // データが0件の時の対策（エラー回避）
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // 色設定（緑とグレー）
  const COLORS = ['#4CAF50', '#E0E0E0'];

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>About</h1>
      <h2>直近1週間の達成率</h2>

      {/* データが1件もない場合の表示分け */}
      {total === 0 ? (
        <p style={{ color: '#666', marginTop: '50px' }}>
          この1週間のタスクはまだありません。<br />
          タスクを追加してみましょう！
        </p>
      ) : (
        <div style={{ width: '100%', height: 300, position: 'relative' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          
          {/* 中央の％表示 */}
          <div style={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {percentage}%
          </div>
        </div>
      )}
      
      {/* デバッグ用 */}
      <p style={{ fontSize: '12px', color: '#888' }}>
        (対象タスク数: {total}件 / 完了: {completed}件)
      </p>
    </div>
  );
}