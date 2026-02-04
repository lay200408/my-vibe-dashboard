import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PoetryProps {
  themeHue: number;
}

interface Poem {
  content: string;
  author: string;
  title: string;
}

function Poetry({ themeHue }: PoetryProps) {
  const poems: Poem[] = [
    {
      content: '行到水穷处，坐看云起时。',
      author: '王维',
      title: '终南别业',
    },
    {
      content: '采菊东篱下，悠然见南山。',
      author: '陶渊明',
      title: '饮酒',
    },
    {
      content: '空山新雨后，天气晚来秋。',
      author: '王维',
      title: '山居秋暝',
    },
    {
      content: '人闲桂花落，夜静春山空。',
      author: '王维',
      title: '鸟鸣涧',
    },
    {
      content: '流水落花春去也，天上人间。',
      author: '李煜',
      title: '浪淘沙',
    },
    {
      content: '世事一场大梦，人生几度秋凉。',
      author: '苏轼',
      title: '西江月',
    },
    {
      content: '云无心以出岫，鸟倦飞而知还。',
      author: '陶渊明',
      title: '归去来兮辞',
    },
    {
      content: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
      author: '苏轼',
      title: '定风波',
    },
  ];

  const [currentPoem, setCurrentPoem] = useState<Poem>(poems[0]);

  const getRandomPoem = () => {
    const randomIndex = Math.floor(Math.random() * poems.length);
    setCurrentPoem(poems[randomIndex]);
  };

  useEffect(() => {
    getRandomPoem();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-8">
      <div
        className="backdrop-blur-lg rounded-3xl p-12 shadow-lg border max-w-2xl w-full"
        style={{
          backgroundColor: `hsla(${themeHue}, 70%, 98%, 0.4)`,
          borderColor: `hsla(${themeHue}, 60%, 100%, 0.6)`,
        }}
      >
        <div
          className="text-4xl leading-relaxed mb-8 text-center font-serif"
          style={{ color: `hsl(${themeHue}, 60%, 35%)` }}
        >
          {currentPoem.content}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-right">
            <div
              className="text-lg mb-1"
              style={{ color: `hsl(${themeHue}, 50%, 45%)` }}
            >
              {currentPoem.title}
            </div>
            <div
              className="text-base"
              style={{ color: `hsl(${themeHue}, 40%, 55%)` }}
            >
              — {currentPoem.author}
            </div>
          </div>

          <button
            onClick={getRandomPoem}
            className="ml-8 p-3 rounded-xl transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: `hsla(${themeHue}, 70%, 90%, 0.6)`,
              color: `hsl(${themeHue}, 60%, 40%)`,
            }}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Poetry;
