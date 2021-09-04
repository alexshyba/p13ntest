import { useUniformTracker } from '@uniformdev/optimize-tracker-react';
import { useState } from 'react';

const QUIZ = [
  {
    question: "What's your CMS?",
    answers: [
      { label: 'Contentful', intent: 'cms-contentful' },
      { label: 'Contentstack', intent: 'cms-contentstack' },
      { label: 'Kontent', intent: 'cms-kontent' },
      { label: 'Sanity', intent: 'cms-sanity' },
      { label: 'Salesforce CMS', intent: 'cms-salesforce' },
      { label: 'Sitecore', intent: 'cms-sitecore' },
      { label: 'Other', intent: 'cms-other' },
    ],
  },
  {
    question: "What's your front-end framework?",
    answers: [
      { label: 'Next', intent: 'framework-next' },
      { label: 'Nuxt', intent: 'framework-nuxt' },
      { label: 'Gatsby', intent: 'framework-gatsby' },
      { label: 'Gridsome', intent: 'framework-gridsome' },
      { label: 'VanillaJS', intent: 'framework-vanillajs' },
      { label: 'Other', intent: 'framework-other' },
    ],
  },
  {
    question: "What's your CDN?",
    answers: [
      { label: 'Akamai', intent: 'cdn-akamai' },
      { label: 'Azure', intent: 'cdn-azure' },
      { label: 'AWS', intent: 'cdn-aws' },
      { label: 'Cloudflare', intent: 'cdn-cloudflare' },
      { label: 'Netlify', intent: 'cdn-netlify' },
      { label: 'Vercel', intent: 'cdn-vercel' },
      { label: 'Other', intent: 'cdn-other' },
    ],
  }
];

const MAX_QUIZ_WIDTH = 600;

const Button = ({ children, href, className, ...props }) => {
  const classes =
    'text-black rounded-md shadow transition duration-150 ease-in-out p-2  focus:shadow-outline bg-unfrm-cyan hover:text-unfrm-deeplbue hover:bg-unfrm-cyan-light focus:border-indigo-300 focus:outline-none ' +
    (className || '');

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  }
};

const Question = ({ children }) => (
  <h4 className="text-unfrm-deeplbue mb-3 text-2xl leading-8 font-extrabold">{children}</h4>
);

const Answers = ({ options, answerQuestion }) => (
  <div
    className="grid grid-cols-3 lg:grid-cols-4 auto-rows-min gap-2"
    style={{
      // 32 makes room for paddings
      maxWidth: `calc(--question-width - 32)`,
    }}
  >
    {options.map(({ intent, label }) => (
      <Button key={label} className={label.includes(' ') ? 'col-span-2' : ''} onClick={() => answerQuestion(intent)}>
        {label}
      </Button>
    ))}
  </div>
);

const QuizQuestion = ({ question, answers, onAnswer }) => {
  const tracker = useUniformTracker();

  // bumps scored intent to 100
  // dumps others in options list to 0
  async function scoreIntent(intent) {
    if (tracker?.tracker) {
      const intents = await tracker.tracker.getIntentStrength('visitor');

      // suboptimal algorithm, but N is small
      let newVector = Object.fromEntries(
        Object.entries(intents)
          // pick intents found in options
          .filter(([key]) => answers.find(({ intent }) => key === intent))
          // dump all to 0
          .map(([key]) => [key, { str: 0 }])
      );

      newVector[intent] = { str: 100 };

      tracker?.tracker?.addIntentStrength('visitor', newVector);
    }
  }

  function answerQuestion(intent) {
    scoreIntent(intent);
    onAnswer();
  }

  return tracker ? (
    <div className="inline-block mr-4" style={{ width: 'var(--question-width)' }}>
      <Question>{question}</Question>
      <Answers options={answers} answerQuestion={answerQuestion} />
    </div>
  ) : null;
};

export function FloatingQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  function nextQuestion() {
    setCurrentQuestion(currentQuestion + 1);
  }

  return (
    <div
      className="fixed bottom-0 right-0 bg-white py-2 px-4 z-50 border-t-2 border-l-2 border-gray-100 rounded overflow-hidden"
      style={{ maxWidth: MAX_QUIZ_WIDTH }}
    >
      <div
        className="relative transition-left duration-200 ease-in-out"
        style={{
          // 16px is for mr-4 between questions
          left: `calc((-100% - 16px) * ${currentQuestion})`,
          width: `calc(100% * (${QUIZ.length} + 1))`,
          // calculate question width here
          // because 100% is different for children
          '--question-width': `calc(100% / (${QUIZ.length} + 1))`,
        }}
      >
        {QUIZ.map((q, index) => (
          <QuizQuestion key={index} question={q.question} answers={q.answers} onAnswer={nextQuestion} />
        ))}
        <div className="inline-block mr-4" style={{ width: '--question-width' }}>
          <div className="flex space-x-2">
            <Button href="">Sign Up</Button>
            <Button href="/demo">Demo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
