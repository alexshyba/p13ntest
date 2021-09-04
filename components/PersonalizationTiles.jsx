import { Personalize } from '@uniformdev/optimize-tracker-react';

const CMSoptions = [
  {
    intent: 'cms-other',
  },
  {
    intent: 'cms-contentful',
  },
  {
    intent: 'cms-kontent',
  },
  {
    intent: 'cms-sanity',
  },
  {
    intent: 'cms-contentstack',
  },
  {
    intent: 'cms-sitecore',
  },
  {
    intent: 'cms-salesforce',
  },
];

const FrontendOptions = [
  {
    intent: 'framework-other',
  },
  {
    intent: 'framework-next',
  },
  {
    intent: 'framework-nuxt',
  },
  {
    intent: 'framework-gatsby',
  },
  {
    intent: 'framework-gridsome',
  },
  {
    intent: 'framework-vanillajs',
  },
];

const CDNOptions = [
  {
    intent: 'cdn-other',
  },
  {
    intent: 'cdn-akamai',
  },
  {
    intent: 'cdn-azure',
  },
  {
    intent: 'cdn-aws',
  },
  {
    intent: 'cdn-cloudflare',
  },
  {
    intent: 'cdn-netlify',
  },
  {
    intent: 'cdn-vercel',
  },
];

export const PersonalizationTiles = () => {
  return (
    <div className="max-w-screen-xl mx-auto w-screen py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="grid grid-cols-3 gap-4 py-7">
        <Tile title="Content Management" options={CMSoptions} />
        <Tile title="Front-end framework" options={FrontendOptions} />
        <Tile title="Delivery platform / CDN" options={CDNOptions} />
      </div>
    </div>
  );
};

const Tile = ({ title, options }) => {
  const variations = options.map((option, index) => ({
    intentTag:
      index === 0
        ? { intents: {} }
        : {
            intents: {
              [option.intent]: { str: 100 },
            },
          },
    options,
  }));

  return (
    <div className="text-center">
      <h4 className="text-base font-semibold">Intent: {title}</h4>
      <div>

        {/* This blows up */}

        {/* <Personalize name="aaaaa" variations={variations} trackingEventName="asdasdasd">
          {({ personalized, variations }) => {
            const [variation] = variations;
            return <h1>{JSON.stringify(variation)}</h1>;
          }}
        </Personalize> */}



        {/* This works but each variant re-renders */}
        <Personalize
          variations={variations}
          wrapperComponent={({ children, personalizationOccurred }) => {
            return (
              <div>
                <h1>Personalized: {personalizationOccurred ? 'yes' : 'no'}</h1>
                {children}
              </div>
            );
          }}
          component={props => {
            const matches = props.personalizationResult.variation.matches;
            const match = matches && matches.length > 0 ? matches[0] : 'no match';
            return (
              <p>
                {match} : {new Date().toLocaleString()}
              </p>
            );
          }}
        />
      </div>
    </div>
  );
};

